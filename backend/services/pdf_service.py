import io
import PyPDF2

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    """
    try:
        pdf_file_obj = io.BytesIO(pdf_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
