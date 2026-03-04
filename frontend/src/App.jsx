import { Routes, Route } from 'react-router-dom';
import ResumeUpload from './pages/ResumeUpload';
import InterviewChat from './pages/InterviewChat';
import InterviewSummary from './pages/InterviewSummary';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ResumeUpload />} />
      <Route path="/interview" element={<InterviewChat />} />
      <Route path="/summary" element={<InterviewSummary />} />
    </Routes>
  );
}

export default App;
