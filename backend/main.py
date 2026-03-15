from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, interview, auth
from dotenv import load_dotenv
import os

from database import engine
import models.user

# Create database tables
models.user.Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI(title="AI Interview Copilot API")

allowed_origins_env = os.environ.get("ALLOWED_ORIGINS")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
if allowed_origins_env:
    allowed_origins.extend([origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()])
    # If the user specified '*', just use that directly
    if "*" in allowed_origins:
        allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(interview.router, prefix="/api", tags=["Interview"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Interview Copilot API"}

@app.get("/health")
def health():
    return {"status": "ok"}
