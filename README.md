# 🤖 AI Interview Copilot

<div align="center">

![AI Interview Copilot](https://img.shields.io/badge/AI-Interview%20Copilot-6366f1?style=for-the-badge&logo=robot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)

**An AI-powered technical interview simulator that evaluates your answers like a Staff Engineer at Google.**

[Features](#-features) • [Demo](#-screenshots) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture)

</div>

---

## 🎯 What is AI Interview Copilot?

AI Interview Copilot is a full-stack intelligent interview preparation platform. Upload your resume, and the AI generates a **personalized technical interview** based on your actual experience — then evaluates every answer with the precision of a senior engineer, giving you real, actionable feedback.

No more generic mock interviews. No more vague feedback. This tool reads your resume, asks questions about **your projects**, and tells you exactly what you missed.

---

## ✨ Features

### 🧠 Intelligent Question Generation
- Parses your **actual resume** to generate context-aware technical questions
- Focuses on: microservices, system design, REST APIs, Spring Boot, database architecture, security, and scalability
- **Never repeats questions** — tracks history throughout the session
- Follow-up questions dig deeper into what **you specifically said**

### 📊 Staff-Level Answer Evaluation
- Scores answers honestly from **1–10** (no more flat 6s)
- **Strengths** — quotes what you actually said and explains why it was good
- **Weaknesses** — names the exact concepts you missed (Saga pattern, circuit breakers, Zipkin, etc.)
- **Ideal Technical Response** — shows you what a Google/Amazon-level answer looks like
- Powered by **Google Gemini AI** with bulletproof JSON parsing and fallback logic

### 💬 Real Chat Interface
- Live session timer and recording indicator
- AI message bubbles with typing animation
- Evaluation cards slide in after each answer
- Auto-scrolls to the latest message
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### 📈 Interview Summary Dashboard
- SVG circular progress score ring
- 3 metric cards: **Technical Depth**, **Communication**, **Problem Solving**
- Animated score counters
- Hiring manager notes with honest hireability assessment
- Full interview transcript log
- PDF report download

---

## 📸 Screenshots

### Resume Upload
> Clean glassmorphism card with drag & drop resume upload and difficulty selector

### Interview Chat
> Real-time chat with AI bubbles, user responses, and evaluation cards showing score, strengths, weaknesses, and ideal answers

### Summary Dashboard
> Post-interview dashboard with score ring, metric cards, hiring manager notes, and full transcript

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | CSS-in-JSX (inline `<style>` blocks) |
| **Backend** | FastAPI (Python) |
| **AI Engine** | Google Gemini API |
| **PDF Parsing** | PyMuPDF / pdfplumber |
| **HTTP Client** | Axios |
| **State Management** | React useState / useEffect |

---

## 🏗 Architecture

```
ai-interview-copilot/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ResumeUpload.jsx      # Upload page with drag & drop
│   │   │   ├── InterviewChat.jsx     # Live chat interface + evaluation cards
│   │   │   └── InterviewSummary.jsx  # Results dashboard
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py                       # FastAPI app + route definitions
│   ├── services/
│   │   └── gemini_service.py         # AI evaluation logic + prompt engineering
│   ├── utils/
│   │   └── pdf_parser.py             # Resume text extraction
│   ├── requirements.txt
│   └── .env                          # API keys (never commit this)
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/RishiDusane/ai-interview-copilot.git
cd ai-interview-copilot
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```

Open `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:
```bash
uvicorn main:app --reload
```
> Backend runs at `http://localhost:8000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

## 💡 Usage

1. **Upload Resume** — Drag & drop your PDF resume onto the upload zone
2. **Select Difficulty** — Choose Junior, Mid, or Senior level
3. **Start Interview** — Click "Start Technical Interview"
4. **Answer Questions** — The AI asks questions based on your actual resume
5. **Get Evaluated** — See your score, strengths, weaknesses, and the ideal answer after each response
6. **View Summary** — Review your full performance dashboard at the end

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

---

## 🧪 How the AI Evaluation Works

The evaluation prompt is engineered to behave like a **Staff Engineer interviewer**:

```
Scoring Rubric:
9-10 → Exceptional: covers architecture, trade-offs, edge cases
7-8  → Strong: main concepts correct, minor gaps only  
5-6  → Average: basics covered, lacks depth
3-4  → Weak: vague, incomplete, or incorrect
1-2  → Poor: off-topic or wrong
```

The AI is explicitly instructed to:
- Quote what you actually said in the feedback
- Name the specific missing concepts (e.g., "You didn't mention Resilience4j for circuit breaking")
- Generate a model answer at Senior Engineer level
- Ask a follow-up question based on YOUR specific answer

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "✨ Add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Rishi Dusane**

[![GitHub](https://img.shields.io/badge/GitHub-RishiDusane-181717?style=flat&logo=github)](https://github.com/RishiDusane)

---

<div align="center">

⭐ **If this project helped you, please give it a star!** ⭐

Built with 🤖 AI + ❤️ by Rishi Dusane

</div>
