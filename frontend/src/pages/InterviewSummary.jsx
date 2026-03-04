import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSummary } from '../services/api';
import { Target, MessageSquare, Zap, ChevronRight, ChevronLeft, Download, RefreshCw } from 'lucide-react';

const colors = {
    bg: '#0a0f1e',
    surface: '#111827',
    surface2: '#1a2235',
    border: '#1e2d45',
    accent: '#6366f1',
    accent2: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    textPrim: '#f1f5f9',
    textSec: '#94a3b8',
};

export default function InterviewSummary() {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getSummary();
                setSummary(data);
            } catch (err) {
                setError("Unable to generate summary due to an error");
            }
        };
        fetchSummary();
    }, []);

    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                    <p style={{ color: colors.danger, fontWeight: '700', marginBottom: '24px', fontSize: '16px' }}>{error}</p>
                    <button onClick={() => navigate('/')} style={{ width: '100%', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.textPrim, padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Go Back</button>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
                <div className="spinner" style={{ width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${colors.border}`, borderTopColor: colors.accent, marginBottom: '24px' }} />
                <p style={{ color: colors.textSec, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '14px' }}>Compiling Results Dashboard...</p>
                <style>{`.spinner { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const overallScore = Math.round((summary.technical + summary.communication + summary.problem_solving) / 3);

    return (
        <div style={{
            minHeight: '100vh',
            background: colors.bg,
            color: colors.textPrim,
            padding: '48px 24px',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflowX: 'hidden'
        }}>

            {/* Background glow */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

                {/* Navigation */}
                <button
                    className="nav-btn"
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSec, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginBottom: '32px', padding: 0 }}
                >
                    <ChevronLeft size={18} /> Dashboard Home
                </button>

                {/* Hero Banner */}
                <div style={{ textAlign: 'center', marginBottom: '48px', animation: 'fadeUp 0.6s ease forwards' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 16px 0', color: colors.textPrim }}>
                        Interview Complete 🎯
                    </h1>
                    <p style={{ color: colors.textSec, fontSize: '18px', margin: 0 }}>
                        Here is the detailed breakdown of your technical proficiency and communication skills.
                    </p>
                </div>

                {/* Massive SVG Dashboard Score Circle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '56px', animation: 'fadeUp 0.6s ease forwards', animationDelay: '0.1s', opacity: 0 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '160px', height: '160px' }}>
                        <svg viewBox="0 0 120 120" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="60" cy="60" r="50" fill="none" stroke={colors.border} strokeWidth="8" />
                            <circle cx="60" cy="60" r="50" fill="none"
                                stroke="url(#scoreGrad)" strokeWidth="8"
                                strokeDasharray="314 314"
                                strokeDashoffset={314 - ((overallScore / 10) * 314)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                            />
                            <defs>
                                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <AnimatedCounter end={overallScore} inlineStyles={{ fontSize: '42px', fontWeight: '900', lineHeight: 1 }} />
                            <span style={{ fontSize: '12px', fontWeight: '700', color: colors.accent, letterSpacing: '0.1em', marginTop: '4px' }}>/10 SCORE</span>
                        </div>
                    </div>
                </div>

                {/* Metric Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px', animation: 'fadeUp 0.6s ease forwards', animationDelay: '0.2s', opacity: 0 }}>
                    <MetricCard title="Technical Depth" score={summary.technical} icon={<Target size={24} />} accent={colors.success} bgAccent="rgba(16,185,129,0.1)" />
                    <MetricCard title="Communication" score={summary.communication} icon={<MessageSquare size={24} />} accent={colors.accent} bgAccent="rgba(99,102,241,0.1)" />
                    <MetricCard title="Problem Solving" score={summary.problem_solving} icon={<Zap size={24} />} accent={colors.warning} bgAccent="rgba(245,158,11,0.1)" />
                </div>

                {/* Notes Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', animation: 'fadeUp 0.6s ease forwards', animationDelay: '0.3s', opacity: 0 }}>
                    {/* Feedback Section */}
                    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 24px 0', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>Hiring Manager Notes</h2>
                        <div style={{ background: colors.surface2, padding: '24px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                            <p style={{ margin: 0, color: colors.textSec, lineHeight: '1.8', fontSize: '15px' }}>{summary.feedback}</p>
                        </div>
                    </div>

                    {/* Improvements Section */}
                    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 24px 0', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>Areas for Growth</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(summary.improvement_areas || []).map((area, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: colors.surface2, padding: '20px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                                    <div style={{ width: '28px', height: '28px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <ChevronRight size={16} />
                                    </div>
                                    <span style={{ color: colors.textSec, fontSize: '15px', lineHeight: '1.6', fontWeight: '500' }}>{area}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transcript Area */}
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '32px', marginTop: '24px', animation: 'fadeUp 0.6s ease forwards', animationDelay: '0.4s', opacity: 0 }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 24px 0' }}>Interview Transcript Log</h2>
                    <div className="custom-scroller" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(summary.transcript || []).map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: colors.textSec, marginBottom: '8px', padding: '0 12px' }}>
                                    {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                                </span>
                                <div style={{
                                    maxWidth: '85%',
                                    background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : colors.surface2,
                                    border: msg.role === 'user' ? 'none' : `1px solid ${colors.border}`,
                                    padding: '16px 24px',
                                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                    color: msg.role === 'user' ? '#fff' : colors.textPrim,
                                    fontSize: '14px',
                                    lineHeight: '1.7'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '48px', animation: 'fadeUp 0.6s ease forwards', animationDelay: '0.5s', opacity: 0 }}>
                    <button
                        className="cta-secondary"
                        onClick={() => window.open('http://localhost:8000/api/download-report', '_blank')}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', background: colors.surface, border: `1px solid ${colors.border}`, color: colors.textPrim, padding: '16px 32px', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Download size={20} color={colors.accent} /> Download PDF Report
                    </button>
                    <button
                        className="cta-primary"
                        onClick={() => navigate('/')}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}
                    >
                        <RefreshCw size={20} /> Restart Interview
                    </button>
                </div>

            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .nav-btn:hover { color: #f1f5f9 !important; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(99,102,241,0.4) !important; }
        .cta-secondary:hover { background: #1a2235 !important; border-color: #6366f1 !important; transform: translateY(-2px); }
        .custom-scroller::-webkit-scrollbar { width: 6px; }
        .custom-scroller::-webkit-scrollbar-track { background: transparent; }
        .custom-scroller::-webkit-scrollbar-thumb { background-color: #1e2d45; border-radius: 10px; }
      `}</style>
        </div>
    );
}

function AnimatedCounter({ end, inlineStyles }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else { setCount(Math.round(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [end]);
    return <span style={inlineStyles}>{count}</span>;
}

function MetricCard({ title, score, icon, accent, bgAccent }) {
    const val = Number(score) || 0;
    const pct = (val / 10) * 100;
    const [animatedPct, setAnimatedPct] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedPct(pct), 300);
        return () => clearTimeout(timer);
    }, [pct]);

    return (
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ background: bgAccent, color: accent, padding: '16px', borderRadius: '16px' }}>
                    {icon}
                </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: colors.textPrim, marginBottom: '8px', display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                <AnimatedCounter end={val} inlineStyles={{}} />
                <span style={{ fontSize: '18px', color: colors.textSec, fontWeight: '700', marginLeft: '2px' }}>/10</span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: colors.textSec, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>{title}</h3>

            <div style={{ background: colors.surface2, borderRadius: '999px', height: '6px', width: '100%', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    background: accent,
                    width: `${animatedPct}%`,
                    borderRadius: '999px',
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
            </div>
        </div>
    )
}
