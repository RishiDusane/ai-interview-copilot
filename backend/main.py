from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, interview
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Interview Copilot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(interview.router, prefix="/api", tags=["Interview"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Interview Copilot API"}
