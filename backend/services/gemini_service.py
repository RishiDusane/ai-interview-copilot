import os
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List
import json
import logging
import random

logger = logging.getLogger(__name__)

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_gemini_api_key_here":
    logger.warning("GEMINI_API_KEY is not set correctly in .env file.")
else:
    genai.configure(api_key=api_key)

MODEL_NAME = "gemini-1.5-flash"

class EvaluationResult(BaseModel):
    score: int
    strengths: str
    weaknesses: str
    improved_answer: str
    next_question: str

FALLBACK_QUESTIONS = [
    "Explain how you design a scalable microservices architecture.",
    "What are the key differences between SQL and NoSQL databases, and when would you choose one over the other?",
    "How do you implement secure authentication and authorization in a REST API?",
    "Describe the lifecycle of a Spring Boot application and its core annotations.",
    "How would you optimize a slow-performing database query in a production environment?",
    "Explain the concept of CI/CD and how you would set up a robust deployment pipeline.",
    "What strategies do you use for caching in a high-traffic distributed application?",
    "How do you handle distributed transactions and ensure data consistency across services?",
    "Describe a time you had to troubleshoot and resolve a complex scalability or performance issue.",
    "What are the best practices for structuring, securing, and deploying applications to a cloud environment like AWS?"
]

def get_fallback_unique_question(previous_questions: List[str]) -> str:
    """Returns a unique fallback question that hasn't been asked yet."""
    available = [q for q in FALLBACK_QUESTIONS if q not in previous_questions]
    if not available:
        return "Can you elaborate on your experience with system testing, QA, and maintaining high code coverage?"
    return random.choice(available)

def extract_json_safe(text: str) -> str:
    """Extracts JSON from text by finding the first { and last }."""
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1:
        return text[start:end+1]
    return text

def generate_initial_question(resume_context: str, difficulty: str = "mid") -> str:
    """Generates the first technical interview question based on the resume."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
        You are a senior technical interviewer. Generate exactly ONE direct opening technical question based on the candidate's resume context.
        Focus on: system design, microservices architecture, REST API design, database optimization, Spring Boot, security implementation, scalability strategies, and real project trade-offs.
        Do NOT ask soft-skill or HR questions.
        
        Difficulty level: {difficulty}
        
        Resume context:
        {resume_context}
        
        Question:
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error generating question: {e}")
        return "Can you explain the architecture and technical stack of the most complex system you have worked on?"

def evaluate_answer(
    question: str, 
    answer: str, 
    resume_context: str, 
    difficulty: str = "mid",
    previous_questions: str = ""
) -> EvaluationResult:
    """Evaluates the candidate's answer and provides strict JSON feedback + unique next question."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"""
        IMPORTANT: Your response must start with {{ and end with }}. Nothing else outside the JSON.
        
        You are a Staff-level Software Engineer and Technical Interview Assessor at a top tech company (Google/Amazon level). You are conducting a real technical interview.
        
        CANDIDATE'S RESUME CONTEXT:
        {resume_context}
        
        QUESTION ASKED:
        {question}
        
        CANDIDATE'S ANSWER:
        {answer}
        
        Your job is to deeply analyze the candidate's answer and provide a brutally honest, specific, intelligent evaluation.
        
        SCORING RULES (be strict and accurate — do NOT default to 6):
        - 9-10: Answer is exceptional. Covers architecture, trade-offs, edge cases, real-world experience. Better than most senior engineers.
        - 7-8: Answer is strong. Covers the main concepts correctly with good depth. Minor gaps only.
        - 5-6: Answer is average. Covers basics but misses important technical depth, trade-offs, or specifics.
        - 3-4: Answer is weak. Vague, incomplete, or technically incorrect in key areas.
        - 1-2: Answer is very poor. Off-topic, wrong, or demonstrates no understanding.
        
        EVALUATION RULES:
        - strengths: Be SPECIFIC. Quote or reference what the candidate actually said. Explain exactly WHY it was good technically. Minimum 2 sentences.
        - weaknesses: Be SPECIFIC. Point out exactly what was missing, vague, or wrong. Name the specific concepts they should have mentioned. Minimum 2 sentences.
        - improved_answer: Write a complete, expert-level model answer to the same question. This should be what a senior engineer at Google would say. Include: specific technologies, architectural decisions, trade-offs, real-world considerations, and concrete examples. Minimum 4-5 sentences.
        - next_question: Ask a FOLLOW-UP question that directly digs deeper into something the candidate mentioned in their answer. Make it specific to what THEY said, not a generic question.
        
        Previously asked questions (DO NOT repeat any of these):
        {previous_questions}
        
        Return ONLY this JSON:
        {{
          "score": 8,
          "strengths": "Specific strengths referencing what candidate actually said",
          "weaknesses": "Specific weaknesses naming exact missing concepts",
          "improved_answer": "Complete expert-level model answer, 4-5 sentences minimum",
          "next_question": "Follow-up question specific to candidate's answer"
        }}
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        logger.info(f"Raw Gemini evaluation response: {text_response}")
        
        start = text_response.find('{')
        end = text_response.rfind('}')
        if start == -1 or end == -1:
            raise ValueError("No JSON braces found in Gemini response.")
            
        clean_json = text_response[start:end+1]
        
        try:
            result_dict = json.loads(clean_json)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {e}")
            logger.error(f"Gemini raw response: {text_response}")
            
            # Safe Fallback
            history_list = [q.strip() for q in previous_questions.split('\n') if q.strip()]
            result_dict = {
                "score": 6,
                "strengths": "Good attempt at answering the technical question.",
                "weaknesses": "Answer lacks deeper technical explanation and architectural clarity.",
                "improved_answer": "Provide a clearer explanation including architecture decisions, trade-offs, and technologies used.",
                "next_question": get_fallback_unique_question(history_list)
            }
        
        # Ensure correct types based on requested schema using safe .get() defaults
        score = int(result_dict.get("score", 6))
        if score < 1 or score > 10:
            score = 6
            
        strengths = str(result_dict.get("strengths", "Good attempt at answering the question."))
        weaknesses = str(result_dict.get("weaknesses", "Needs more technical depth."))
        improved_answer = str(result_dict.get("improved_answer", "Explain the concept more clearly with technical trade-offs."))
        next_question = str(result_dict.get("next_question", "Describe the architecture of one of your recent projects."))
        
        # Prevent Identity Loops
        history_list = [q.strip() for q in previous_questions.split('\n') if q.strip()]
        if next_question in history_list or next_question == question:
            next_question = get_fallback_unique_question(history_list)
            
        return EvaluationResult(
            score=score,
            strengths=strengths,
            weaknesses=weaknesses,
            improved_answer=improved_answer,
            next_question=next_question
        )
        
    except Exception as e:
        logger.error(f"Error evaluating answer: {e}", exc_info=True)
        history_list = [q.strip() for q in previous_questions.split('\n') if q.strip()]
        return EvaluationResult(
            score=6,
            strengths="Good attempt at answering the question.",
            weaknesses="Answer lacks deeper technical explanation.",
            improved_answer="Provide a clearer explanation including architecture decisions, trade-offs, and technologies used.",
            next_question=get_fallback_unique_question(history_list)
        )

def generate_interview_summary(history: List[dict]) -> dict:
    """Generates the final interview report based on chat history."""
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        
        formatted_history = ""
        for msg in history:
            role = "Interviewer" if msg['role'] == 'bot' else "Candidate"
            formatted_history += f"{role}: {msg['text']}\n"
            
        prompt = f"""
        IMPORTANT: Your response must start with {{ and end with }}. Nothing else.
        
        You are a senior hiring manager writing a post-interview assessment report.
        
        FULL INTERVIEW TRANSCRIPT:
        {formatted_history}
        
        CANDIDATE RESUME:
        (Context provided dynamically via chat, assume resume matches transcript depth)
        
        Analyze the entire interview and write a detailed, honest assessment. 
        
        RULES:
        - technical: Score 1-10 based on actual technical depth shown across all answers
        - communication: Score 1-10 based on clarity, structure, and articulation of answers
        - problem_solving: Score 1-10 based on how well they broke down problems and proposed solutions
        - feedback: Write 3-4 sentences of specific hiring manager notes. Reference actual things the candidate said. Be honest — would you hire this person? Why or why not?
        - improvement_areas: List 3-4 SPECIFIC things this candidate needs to improve, based on actual gaps you observed in their answers. Be concrete, not generic.
        
        Return ONLY this JSON:
        {{
          "technical": 8,
          "communication": 8,
          "problem_solving": 8,
          "feedback": "Specific 3-4 sentence hiring manager assessment.",
          "improvement_areas": ["specific gap 1", "specific gap 2", "specific gap 3", "specific gap 4"]
        }}
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        logger.info(f"Raw Gemini summary response: {text_response}")
        
        clean_json = extract_json_safe(text_response)
        
        try:
            result_dict = json.loads(clean_json)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed for summary: {e}")
            result_dict = {
                "technical": 6,
                "communication": 6,
                "problem_solving": 6,
                "feedback": "The candidate demonstrated familiarity with key technical concepts and communicated their experience clearly. Recommend a follow-up round focusing on deeper system design.",
                "improvement_areas": [
                    "Improve answer structure",
                    "Provide more technical depth",
                    "Include concrete metrics and trade-offs in responses"
                ]
            }
        
        technical = int(result_dict.get("technical", 6))
        communication = int(result_dict.get("communication", 6))
        problem_solving = int(result_dict.get("problem_solving", 6))
        
        if technical < 1: technical = 6
        if communication < 1: communication = 6
        if problem_solving < 1: problem_solving = 6
        
        feedback = str(result_dict.get("feedback", "Good effort during the interview."))
        improvement_areas = result_dict.get("improvement_areas", [])
        if not isinstance(improvement_areas, list) or len(improvement_areas) == 0:
            improvement_areas = ["Improve answer structure", "Provide more technical depth"]
        
        return {
            "technical": technical,
            "communication": communication,
            "problem_solving": problem_solving,
            "feedback": feedback,
            "improvement_areas": improvement_areas
        }
        
    except Exception as e:
        logger.error(f"Error generating summary: {e}", exc_info=True)
        return {
            "technical": 6,
            "communication": 6,
            "problem_solving": 6,
            "feedback": "The candidate demonstrated familiarity with key technical concepts and communicated their experience clearly. Recommend a follow-up round focusing on deeper system design.",
            "improvement_areas": [
                "Improve answer structure",
                "Provide more technical depth",
                "Include concrete metrics and trade-offs in responses"
            ]
        }
