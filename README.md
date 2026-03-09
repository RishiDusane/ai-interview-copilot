<div align="center">

<!-- Animated Header Banner -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=200&section=header&text=AI%20Interview%20Copilot&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Your%20Personal%20Staff-Engineer%20Interview%20Coach&descAlignY=58&descSize=18&animation=fadeIn"/>

<!-- Animated Typing SVG -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=6366F1&center=true&vCenter=true&random=false&width=700&lines=Upload+Resume+%E2%86%92+Get+Personalized+Questions;Answer+%E2%86%92+Get+Staff-Engineer+Feedback;Score+%2B+Strengths+%2B+Weaknesses+%2B+Model+Answer;Secure+Auth+%2B+Email+Verification+%F0%9F%94%90;Ace+Your+Next+Technical+Interview+%F0%9F%9A%80" alt="Typing SVG" />
</a>

<br/><br/>

<!-- Badges Row 1 -->
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

<!-- Badges Row 2 -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square)](https://github.com/RishiDusane)
[![Stars](https://img.shields.io/github/stars/RishiDusane/ai-interview-copilot?style=flat-square&color=6366f1)](https://github.com/RishiDusane/ai-interview-copilot/stargazers)

<br/>

> **Stop practicing with generic questions. Start training with AI that knows your resume inside out.**

<br/>

</div>

---

## 🌟 What Makes This Different?

<table>
<tr>
<td width="50%">

### ❌ Traditional Mock Interviews
- Generic, repetitive questions
- No personalization to your background
- Vague feedback like *"good job"*
- No model answers to learn from
- Static difficulty, no real progression
- No user accounts or history

</td>
<td width="50%">

### ✅ AI Interview Co-Pilot
- Questions based on **YOUR actual resume**
- Feedback that quotes **what you said**
- Honest scores from 1–10 (no flat 6s!)
- Expert-level model answers every round
- Dynamic follow-ups that dig deeper
- Secure accounts with JWT authentication

</td>
</tr>
</table>

---

## 📸 Screenshots

### 🔐 Login Page
<img width="1920" height="1080" alt="Login" src="https://github.com/user-attachments/assets/7f0f5513-3b7d-4556-8109-0d0eb9e87e5f" />


### 📝 Create Account
<img width="1920" height="1080" alt="CreateAccount" src="https://github.com/user-attachments/assets/da918068-b2a4-48fb-ad1e-153c7d88a606" />


### 🔑 Forgot Password
<img width="1920" height="1080" alt="ForgotPassword" src="https://github.com/user-attachments/assets/b2c3c7c3-4d96-4776-abc6-7c28f01fc502" />


### 🏠 Home Page — Resume Upload
<img width="1920" height="1080" alt="HomePage" src="https://github.com/user-attachments/assets/77f6a3e1-d64d-4de6-8e3c-cb033f6ead5a" />


### 💬 Live Interview Chat
<img width="1920" height="1080" alt="Interview Chat Page" src="https://github.com/user-attachments/assets/a2c3aac7-c828-438f-ad65-07aa9dd50a54" />


### 📊 Summary Dashboard
<img width="1920" height="1080" alt="Summary dashboard" src="https://github.com/user-attachments/assets/f7918835-f656-493d-8931-e18817a60d2e" />


---

## ✨ Features

<details>
<summary><b>🔐 Secure Authentication System</b></summary>
<br/>

Full production-grade authentication built in:

- **Register** with full name, email & password
- **Email verification** — account activated via verification link
- **JWT-based login** — secure token stored in localStorage
- **Forgot password** — reset link sent to email
- **Protected routes** — interview pages require login
- **Auto logout** — token expiry handled automatically
- Password strength indicator on registration
- Show/Hide password toggle on all forms

</details>

<details>
<summary><b>🧠 Intelligent Resume-Based Question Generation</b></summary>
<br/>

The AI parses your actual resume and generates questions about **your specific projects, technologies, and experience** — not generic textbook questions.

- Targets: microservices, system design, REST APIs, Spring Boot, databases, security, scalability
- **Zero question repetition** — full history tracking across the session
- Follow-up questions reference exactly what you said in your last answer
- Three difficulty modes: Junior → Mid → Senior

</details>

<details>
<summary><b>📊 Staff-Engineer Level Evaluation Engine</b></summary>
<br/>

Powered by Google Gemini with a custom prompt engineered to evaluate like a hiring manager at a top-tier tech company.

```
Scoring Rubric:
┌──────────────────────────────────────────────────────────────┐
│  9-10  →  Exceptional. Architecture + trade-offs + edge cases │
│  7-8   →  Strong. Main concepts correct, minor gaps only      │
│  5-6   →  Average. Basics covered, lacks depth                │
│  3-4   →  Weak. Vague, incomplete, or incorrect               │
│  1-2   →  Poor. Off-topic or demonstrates no understanding    │
└──────────────────────────────────────────────────────────────┘
```

Each evaluation includes:
- **✅ Strengths** — Quotes your exact words, explains why it was technically strong
- **⚠️ Weaknesses** — Names specific concepts you missed (e.g., Saga pattern, Resilience4j, Zipkin)
- **💡 Ideal Answer** — Complete senior-engineer model response with tech, trade-offs & real-world context

</details>

<details>
<summary><b>💬 Premium Dark Chat Interface</b></summary>
<br/>

- Deep navy glassmorphism UI (`#0a0f1e` theme)
- Live session timer with pulsing recording indicator
- Typing animation dots while AI is generating
- Smooth slide-in evaluation cards
- Auto-scroll to latest message
- User name displayed in header with logout button
- Keyboard shortcuts: `Enter` to send · `Shift+Enter` for new line

</details>

<details>
<summary><b>📈 Interview Summary Dashboard</b></summary>
<br/>

Post-interview analytics page with:
- **SVG Circular Score Ring** with animated gradient stroke
- **3 Metric Cards**: Technical Depth · Communication · Problem Solving
- Score counters that animate up from 0 on page load
- Hiring Manager Notes — honest hireability assessment
- Specific improvement areas based on actual gaps observed
- Full interview transcript log
- PDF Report download
- Logout button in header

</details>

---

## 🏗️ Project Architecture

```
ai-interview-copilot/
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx             ← Secure login page
│   │   │   ├── Register.jsx          ← Create account page
│   │   │   ├── ForgotPassword.jsx    ← Password reset request
│   │   │   ├── ResetPassword.jsx     ← Password reset form
│   │   │   ├── VerifyEmail.jsx       ← Email verification
│   │   │   ├── ResumeUpload.jsx      ← Drag & drop upload + difficulty picker
│   │   │   ├── InterviewChat.jsx     ← Live chat + evaluation cards
│   │   │   └── InterviewSummary.jsx  ← Analytics dashboard
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx    ← Auth guard for private pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── ⚙️ backend/
│   ├── main.py                       ← FastAPI app + CORS + routes
│   ├── database.py                   ← SQLAlchemy DB connection
│   ├── models/
│   │   └── user.py                   ← User model
│   ├── schemas/
│   │   └── auth.py                   ← Pydantic request/response schemas
│   ├── routes/
│   │   └── auth.py                   ← Auth endpoints
│   ├── services/
│   │   ├── gemini_service.py         ← AI evaluation + prompt engineering
│   │   ├── auth_service.py           ← JWT + password hashing
│   │   └── email_service.py          ← Email sending logic
│   └── utils/
│       └── pdf_parser.py             ← Resume text extraction
│
├── screenshots/                      ← App screenshots
├── .env.example                      ← Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version    # v18+  required
python --version  # 3.10+ required
```

You'll also need a free **[Google Gemini API Key →](https://aistudio.google.com/app/apikey)**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RishiDusane/ai-interview-copilot.git
cd ai-interview-copilot
```

---

### 2️⃣ Set Up the Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac / Linux

# Install all dependencies
pip install -r requirements.txt

# Set up your environment variables
cp .env.example .env
# Open .env and add your keys

# Start the API server
uvicorn main:app --reload
```

> ✅ Backend running at `http://localhost:8000`

---

### 3️⃣ Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

> ✅ Frontend running at `http://localhost:5173`

---

### 4️⃣ Start Your Interview!

```
Open → http://localhost:5173
```

Create account → Verify email → Login → Upload Resume → Begin interview 🎯

---

## 🔐 Environment Variables

Create a `.env` file inside `/backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional — for real email sending
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_FROM=your_email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes |
| `SECRET_KEY` | JWT signing secret | ✅ Yes |
| `ALGORITHM` | JWT algorithm (HS256) | ✅ Yes |
| `MAIL_USERNAME` | Gmail address for sending emails | ⚡ Optional |
| `MAIL_PASSWORD` | Gmail App Password | ⚡ Optional |

> 💡 **Without email config**: verification & reset links are printed to the terminal for easy testing.

> ⚠️ `.env` is already listed in `.gitignore` — your keys are safe.

---

## 🧠 How the AI Pipeline Works

```
👤 User registers & logs in (JWT)
     ↓
📄 Resume PDF uploaded
     ↓
  Text Extraction (PyMuPDF)
     ↓
  Gemini AI Prompt Engine
     ↓
  Personalized Question Generated
     ↓
  Candidate Submits Answer
     ↓
  ┌─────────────────────────────┐
  │     Evaluation Engine        │
  │  • Score (1–10, honest)      │
  │  • Strengths (specific)      │
  │  • Weaknesses (specific)     │
  │  • Model Answer (expert)     │
  │  • Follow-up Question        │
  └─────────────────────────────┘
     ↓
  Next Question → Loop continues
     ↓
  Summary Dashboard Generated
     ↓
  Logout securely 🔐
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework + fast dev builds |
| **Styling** | CSS-in-JSX `<style>` blocks | Zero-dependency, bulletproof rendering |
| **Backend** | FastAPI (Python) | High-performance REST API |
| **AI Engine** | Google Gemini API | Question generation + evaluation |
| **Database** | SQLite + SQLAlchemy | User accounts + auth data |
| **Auth** | JWT + passlib/bcrypt | Secure token-based authentication |
| **Email** | fastapi-mail | Verification & password reset emails |
| **PDF Parsing** | PyMuPDF / pdfplumber | Resume text extraction |
| **HTTP** | Axios | Frontend ↔ Backend communication |

---

## 🤝 Contributing

All contributions are welcome!

```bash
git checkout -b feature/your-amazing-feature
git commit -m "✨ Add amazing feature"
git push origin feature/your-amazing-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

<br/>

**👨‍💻 Built by Rishi Dusane**

[![GitHub](https://img.shields.io/badge/GitHub-RishiDusane-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RishiDusane)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Rishi_Dusane-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rishidusane/)

<br/>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=6366f1&height=120&section=footer"/>

**⭐ If this project helped you land your dream job, please star the repo! ⭐**

*Powered by 🤖 Gemini AI · ⚡ FastAPI · ⚛️ React · 🔐 JWT Auth*

</div>
