import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';
import { Upload, FileText, Sparkles, CheckCircle } from 'lucide-react';

const colors = {
    bg: '#0a0f1e',
    surface: '#111827',
    surface2: '#1a2235',
    border: '#1e2d45',
    accent: '#6366f1',
    accent2: '#8b5cf6',
    success: '#10b981',
    textPrim: '#f1f5f9',
    textSec: '#94a3b8',
};

export default function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [difficulty, setDifficulty] = useState("mid");
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDragHover, setIsDragHover] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragHover(true);
    };

    const handleDragLeave = () => {
        setIsDragHover(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragHover(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.pdf')) {
                setFile(droppedFile);
            }
        }
    };

    const handleUploadClick = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            await uploadResume(file, difficulty);
            setIsSuccess(true);
            setTimeout(() => navigate('/interview'), 1500);
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
            setIsUploading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'sans-serif'
        }}>
            {/* Background Glows */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                left: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            {/* Main Card */}
            <div style={{
                maxWidth: '520px',
                width: '100%',
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '24px',
                padding: '48px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'fadeUp 0.6s ease forwards'
            }}>

                {/* Title Context */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', animation: 'pulse 3s infinite ease-in-out' }}>
                    <Sparkles color={colors.accent} size={28} />
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.textPrim, margin: 0 }}>
                        AI Interview Copilot
                    </h1>
                </div>
                <p style={{ color: colors.textSec, marginBottom: '40px', fontSize: '16px', textAlign: 'center' }}>
                    Upload your resume to generate a customized technical interview.
                </p>

                {!isSuccess ? (
                    <div style={{ width: '100%' }}>
                        {/* Upload Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onMouseEnter={() => setIsDragHover(true)}
                            onMouseLeave={() => setIsDragHover(false)}
                            onClick={() => document.getElementById("file-input").click()}
                            style={{
                                border: `2px dashed ${isDragHover || file ? colors.accent : colors.border}`,
                                background: isDragHover || file ? 'rgba(99,102,241,0.05)' : 'transparent',
                                borderRadius: '16px',
                                padding: '48px 32px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: '32px'
                            }}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <FileText color={colors.accent} size={48} style={{ marginBottom: '16px' }} />
                                    <div style={{
                                        background: 'rgba(99,102,241,0.1)',
                                        border: '1px solid rgba(99,102,241,0.3)',
                                        borderRadius: '8px',
                                        color: colors.accent,
                                        padding: '8px 16px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        marginBottom: '8px'
                                    }}>
                                        {file.name}
                                    </div>
                                    <span style={{ color: colors.textSec, fontSize: '13px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: colors.textSec }}>
                                    <Upload size={40} style={{ marginBottom: '16px', color: isDragHover ? colors.accent : colors.textSec, transition: 'color 0.2s' }} />
                                    <p style={{ fontWeight: '600', margin: '0 0 8px 0', color: colors.textPrim }}>Click to upload or drag & drop</p>
                                    <span style={{ fontSize: '13px' }}>Supported Format: PDF (Max. 5MB)</span>
                                </div>
                            )}
                        </div>

                        {/* Difficulty Selector */}
                        <div style={{ marginBottom: '32px', width: '100%' }}>
                            <label style={{ display: 'block', color: colors.textSec, fontSize: '14px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Interview Difficulty
                            </label>
                            <div style={{ display: 'flex', gap: '8px', background: colors.surface2, padding: '4px', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                                {['junior', 'mid', 'senior'].map((level) => {
                                    const isSelected = difficulty === level;
                                    return (
                                        <button
                                            key={level}
                                            onClick={() => setDifficulty(level)}
                                            style={{
                                                flex: 1,
                                                padding: '10px 0',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                border: isSelected ? `1px solid ${colors.accent}` : '1px solid transparent',
                                                background: isSelected ? 'rgba(99,102,241,0.2)' : 'transparent',
                                                color: isSelected ? colors.accent : colors.textSec,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {level}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleUploadClick}
                            disabled={!file || isUploading}
                            className="start-button"
                            style={{
                                width: '100%',
                                background: !file ? colors.surface2 : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: !file ? colors.textSec : '#fff',
                                border: !file ? `1px solid ${colors.border}` : 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: !file || isUploading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isUploading ? 'Initializing Engine...' : 'Start Technical Interview'}
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.4s ease forwards' }}>
                        <CheckCircle color={colors.success} size={64} style={{ marginBottom: '24px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.textPrim, margin: '0 0 8px 0' }}>Upload Complete</h2>
                        <p style={{ color: colors.textSec, margin: 0 }}>Routing to secure interview environment...</p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        .start-button:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(99,102,241,0.3);
        }
      `}</style>
        </div>
    );
}
