from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from services.vector_service import vector_store
from services.gemini_service import generate_initial_question, evaluate_answer, generate_interview_summary
from utils.models import AnswerRequest

router = APIRouter()

# In-memory storage for the current interview session
# Production: Use Redis or Database keyed by user/session ID
class InterviewSession:
    def __init__(self):
        self.history = []
        self.current_question = ""
        self.difficulty = "mid"
        
session = InterviewSession()

@router.post("/start-interview")
async def start_interview():
    if vector_store.index.ntotal == 0:
        raise HTTPException(status_code=400, detail="Please upload a resume first")
        
    # Reset session history
    session.history = []
    
    # Get a broad context from the resume (top 3 chunks for general summary)
    resume_context = vector_store.search("experience skills technologies background summary", k=3)
    
    # Alternatively if the resume is small enough, we can pass the whole thing
    if len(vector_store.chunks) < 10:
        resume_context = vector_store.get_all_context()
        
    # Generate question
    question = generate_initial_question(resume_context, session.difficulty)
    
    session.current_question = question
    session.history.append({"role": "bot", "text": question})
    
    return {"question": question}


@router.post("/answer")
async def submit_answer(request: AnswerRequest):
    if not session.current_question:
        raise HTTPException(status_code=400, detail="No active interview question")
        
    candidate_answer = request.answer
    session.history.append({"role": "user", "text": candidate_answer})
    
    # Retrieve relevant resume context based on the current question and answer topic
    search_query = f"{session.current_question} {candidate_answer}"
    resume_context = vector_store.search(search_query, k=2)
    
    # Extract previous questions from history
    previous_questions = "\n".join([msg['text'] for msg in session.history if msg['role'] == 'bot'])
    
    # Evaluate with Gemini
    evaluation = evaluate_answer(
        question=session.current_question, 
        answer=candidate_answer, 
        resume_context=resume_context,
        difficulty=session.difficulty,
        previous_questions=previous_questions
    )
    
    # Save the new question to session
    session.current_question = evaluation.next_question
    session.history.append({"role": "bot", "text": evaluation.next_question})
    
    return {
        "feedback": {
            "score": evaluation.score,
            "strengths": evaluation.strengths,
            "weaknesses": evaluation.weaknesses,
            "improved_answer": evaluation.improved_answer
        },
        "next_question": evaluation.next_question
    }


@router.get("/interview-summary")
async def get_interview_summary():
    if not session.history:
        raise HTTPException(status_code=400, detail="No interview history to summarize")
        
    summary = generate_interview_summary(session.history)
    # Inject transcript into response payload
    summary["transcript"] = session.history
    return summary

@router.get("/download-report")
async def download_report():
    if not session.history:
        raise HTTPException(status_code=400, detail="No interview history to summarize")
        
    summary = generate_interview_summary(session.history)
    pdf_path = "interview_report.pdf"
    
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = styles['Title']
    heading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Increase spacing for readability
    Story = []
    
    Story.append(Paragraph("AI Interview Copilot - Performance Report", title_style))
    Story.append(Spacer(1, 24))
    
    Story.append(Paragraph("Interview Summary", heading_style))
    Story.append(Spacer(1, 12))
    
    Story.append(Paragraph("Score Breakdown", heading_style))
    Story.append(Paragraph(f"• Technical Capability: {summary.get('technical', 0)}/10", normal_style))
    Story.append(Paragraph(f"• Communication Skills: {summary.get('communication', 0)}/10", normal_style))
    Story.append(Paragraph(f"• Problem Solving: {summary.get('problem_solving', 0)}/10", normal_style))
    Story.append(Spacer(1, 16))
    
    Story.append(Paragraph("Overall Feedback", heading_style))
    Story.append(Paragraph(str(summary.get('feedback', '')), normal_style))
    Story.append(Spacer(1, 16))
    
    Story.append(Paragraph("Areas for Improvement", heading_style))
    for area in summary.get('improvement_areas', []):
        Story.append(Paragraph(f"• {str(area)}", normal_style))
    Story.append(Spacer(1, 24))
    
    Story.append(Paragraph("Interview Transcript", heading_style))
    Story.append(Spacer(1, 12))
    
    for msg in session.history:
        role = "<b>AI Interviewer:</b>" if msg['role'] == 'bot' else "<b>Candidate:</b>"
        Story.append(Paragraph(f"{role} {msg['text']}", normal_style))
        Story.append(Spacer(1, 10))
        
    doc.build(Story)
    
    return FileResponse(pdf_path, media_type='application/pdf', filename="Interview_Report.pdf")
