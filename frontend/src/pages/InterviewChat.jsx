import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview, submitAnswer } from '../services/api';
import { Send, User, Bot, Flag, Award, CheckCircle2, AlertTriangle, Lightbulb, Clock } from 'lucide-react';

const colors = {
    bg: '#0a0f1e',
    surface: '#111827',
    surface2: '#1a2235',
    border: '#1e2d45',
    accent: '#6366f1',
    accent2: '#8b5cf6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    textPrim: '#f1f5f9',
    textSec: '#94a3b8',
};

export default function InterviewChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [expandedCards, setExpandedCards] = useState({});
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, expandedCards]);

    useEffect(() => {
        initInterview();
    }, []);

    const initInterview = async () => {
        setIsTyping(true);
        try {
            const data = await startInterview();
            setMessages([{ role: 'bot', text: data.question }]);
        } catch (error) {
            console.error("Failed to start", error);
            setMessages([{ role: 'bot', text: "Error starting the interview. Connection failed." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleExpand = (idx) => {
        setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = input.trim();

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const result = await submitAnswer(userMessage);
            setMessages(prev => [...prev, {
                role: 'bot',
                text: result.next_question,
                feedback: {
                    score: result.score || result.feedback?.score || 6,
                    strengths: result.strengths || result.feedback?.strengths || "Good attempt",
                    weaknesses: result.weaknesses || result.feedback?.weaknesses || "Needs more depth",
                    improved_answer: result.improved_answer || result.feedback?.improved_answer || "Elaborate further."
                }
            }]);
        } catch (error) {
            console.error("Error submitting", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: colors.bg,
            overflow: 'hidden',
            fontFamily: 'sans-serif'
        }}>

            {/* Header */}
            <header style={{
                background: 'rgba(10,15,30,0.95)',
                borderBottom: `1px solid ${colors.border}`,
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.2)`, padding: '8px', borderRadius: '12px' }}>
                        <Bot color={colors.accent} size={20} />
                    </div>
                    <div>
                        <h1 style={{ color: colors.textPrim, fontWeight: '700', fontSize: '18px', margin: 0 }}>AI Interview Copilot</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <div style={{ width: '8px', height: '8px', background: colors.danger, borderRadius: '50%', animation: 'pulseRecord 1.5s infinite' }} />
                            <span style={{ color: colors.danger, fontSize: '12px', fontWeight: '600' }}>Live Recording</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.surface, border: `1px solid ${colors.border}`, padding: '8px 16px', borderRadius: '99px', color: colors.textPrim, fontWeight: '600', fontSize: '14px' }}>
                        <Clock color={colors.accent} size={16} />
                        {formatTime(secondsElapsed)}
                    </div>
                    <button
                        onClick={() => navigate('/summary')}
                        className="action-button"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: colors.surface, border: `1px solid ${colors.border}`,
                            color: colors.textPrim, padding: '10px 20px', borderRadius: '12px',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <Flag size={16} /> End Interview
                    </button>
                </div>
            </header>

            {/* Chat Feed */}
            <main className="custom-scroller" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '860px',
                width: '100%',
                margin: '0 auto'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        animation: 'fadeUp 0.4s ease forwards'
                    }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: msg.role === 'user' ? colors.accent : colors.surface2,
                                border: `1px solid ${msg.role === 'user' ? 'transparent' : colors.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: msg.role === 'user' ? '#fff' : colors.accent,
                                flexShrink: 0, marginTop: '4px'
                            }}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '75%',
                                    background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : colors.surface,
                                    border: msg.role === 'user' ? 'none' : `1px solid ${colors.border}`,
                                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                    padding: '16px 20px',
                                    color: msg.role === 'user' ? '#fff' : colors.textPrim,
                                    lineHeight: '1.6',
                                    fontSize: '15px',
                                    boxShadow: msg.role === 'user' ? '0 10px 25px rgba(99,102,241,0.2)' : 'none'
                                }}>
                                    {msg.text}
                                </div>

                                {/* Evaluation Card */}
                                {msg.feedback && (
                                    <div style={{
                                        background: colors.surface,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: '16px',
                                        padding: '24px',
                                        marginTop: '12px',
                                        width: '100%',
                                        maxWidth: '75%',
                                        alignSelf: 'flex-start',
                                        animation: 'fadeUp 0.4s ease forwards',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                    }}>
                                        {/* Header Score Row */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSec, fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <Award color={colors.warning} size={16} /> Evaluation Output
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ color: colors.textSec, fontSize: '13px', fontWeight: '600' }}>SCORE</span>
                                                <div style={{
                                                    width: '44px', height: '44px', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '18px', fontWeight: '800',
                                                    background: msg.feedback.score >= 8 ? 'rgba(16,185,129,0.15)' : msg.feedback.score >= 5 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                                    border: msg.feedback.score >= 8 ? `1px solid rgba(16,185,129,0.5)` : msg.feedback.score >= 5 ? `1px solid rgba(245,158,11,0.5)` : `1px solid rgba(239,68,68,0.5)`,
                                                    color: msg.feedback.score >= 8 ? colors.success : msg.feedback.score >= 5 ? colors.warning : colors.danger
                                                }}>
                                                    {msg.feedback.score}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                            {/* Strengths */}
                                            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '16px', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.success, fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                                                    <CheckCircle2 size={16} /> Strengths
                                                </div>
                                                <p style={{ margin: 0, color: 'rgba(16,185,129,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{msg.feedback.strengths}</p>
                                            </div>

                                            {/* Weaknesses */}
                                            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '16px', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.danger, fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                                                    <AlertTriangle size={16} /> Weaknesses
                                                </div>
                                                <p style={{ margin: 0, color: 'rgba(239,68,68,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{msg.feedback.weaknesses}</p>
                                            </div>
                                        </div>

                                        {/* Improved Answer */}
                                        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                                            <div
                                                onClick={() => toggleExpand(idx)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', color: colors.warning }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px' }}>
                                                    <Lightbulb size={16} /> Ideal Technical Response
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8 }}>{expandedCards[idx] ? 'Close' : 'View'}</span>
                                            </div>

                                            {expandedCards[idx] && (
                                                <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(245,158,11,0.1)' }}>
                                                    <p style={{ margin: '12px 0 0 0', color: 'rgba(245,158,11,0.9)', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic' }}>
                                                        "{msg.feedback.improved_answer}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', animation: 'fadeUp 0.4s ease forwards' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: colors.surface2, border: `1px solid ${colors.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: colors.accent, flexShrink: 0, marginTop: '4px'
                        }}>
                            <Bot size={16} />
                        </div>
                        <div style={{
                            background: colors.surface, border: `1px solid ${colors.border}`,
                            borderRadius: '4px 18px 18px 18px', padding: '18px 20px',
                            display: 'flex', gap: '6px', alignItems: 'center'
                        }}>
                            <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent, animationDelay: '0s' }} />
                            <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent, animationDelay: '0.2s' }} />
                            <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent, animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} style={{ height: '8px' }} />
            </main>

            {/* Input Bar */}
            <footer style={{
                background: colors.surface,
                borderTop: `1px solid ${colors.border}`,
                padding: '24px'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                        <textarea
                            className="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your answer here..."
                            rows="1"
                            disabled={isTyping}
                            style={{
                                flex: 1, background: colors.surface2, border: `1px solid ${colors.border}`,
                                borderRadius: '16px', color: colors.textPrim, padding: '18px 70px 18px 24px',
                                resize: 'none', outline: 'none', fontSize: '15px', fontFamily: 'inherit',
                                minHeight: '60px', maxHeight: '150px'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="send-button"
                            style={{
                                position: 'absolute', right: '8px', top: '8px',
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: !input.trim() || isTyping ? colors.surface : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: !input.trim() || isTyping ? `1px solid ${colors.border}` : 'none',
                                color: !input.trim() || isTyping ? colors.textSec : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Send size={18} style={{ transform: input.trim() ? 'translate(-1px, 1px)' : 'none' }} />
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '13px', color: colors.textMuted, fontWeight: '500' }}>
                        Press <span style={{ background: colors.surface2, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${colors.border}`, margin: '0 4px' }}>Enter</span> to send,
                        <span style={{ background: colors.surface2, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${colors.border}`, margin: '0 4px' }}>Shift + Enter</span> for new line
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulseRecord {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0);    }
          30%           { transform: translateY(-8px); }
        }
        .dot {
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .action-button:hover { background: rgba(255,255,255,0.05) !important; color: #fff !important; }
        .send-button:not(:disabled):hover { transform: scale(1.05); box-shadow: 0 5px 15px rgba(99,102,241,0.4); }
        .chat-input:focus { border-color: #6366f1 !important; background: #111827 !important; }
        
        .custom-scroller::-webkit-scrollbar { width: 6px; }
        .custom-scroller::-webkit-scrollbar-track { background: transparent; }
        .custom-scroller::-webkit-scrollbar-thumb { background-color: #1e2d45; border-radius: 10px; }
      `}</style>
        </div>
    );
}
