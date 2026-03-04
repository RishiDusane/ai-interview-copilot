from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import logging
from services.pdf_service import extract_text_from_pdf
from services.vector_service import vector_store

router = APIRouter()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), difficulty: str = Form("mid")):
    logger.info(f"Received upload request for file: {file.filename}")
    
    if not file.filename.endswith(".pdf"):
        logger.error("File is not a PDF")
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read file content
        logger.info("Reading file content...")
        content = await file.read()
        logger.info(f"File read successfully, size: {len(content)} bytes")
        
        # Extract text from PDF
        logger.info("Extracting text from PDF...")
        extracted_text = extract_text_from_pdf(content)
        
        if not extracted_text:
            logger.error("Failed to extract text from PDF")
            raise HTTPException(status_code=400, detail="Could not extract text from the provided PDF")
            
        logger.info(f"Text extracted successfully, length: {len(extracted_text)} characters")
            
        # Re-initialize vector store for new resume
        logger.info("Re-initializing FAISS vector store...")
        vector_store.__init__()
        
        # Save difficulty in session
        from routes.interview import session
        session.difficulty = difficulty
        
        # Create embeddings and store in FAISS
        logger.info("Creating embeddings and adding to FAISS...")
        vector_store.add_texts(extracted_text)
        logger.info(f"Successfully generated embeddings for {len(vector_store.chunks)} chunks")
        
        response_data = {
            "message": "Resume uploaded and indexed successfully",
            "filename": file.filename,
            "text_length": len(extracted_text),
            "chunks_created": len(vector_store.chunks)
        }
        logger.info(f"Returning successful response: {response_data}")
        return response_data
        
    except Exception as e:
        logger.error(f"Error during upload_resume: {str(e)}", exc_info=True)
        # Ensure we always return an HTTP exception instead of hanging
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
