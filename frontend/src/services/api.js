import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const uploadResume = async (file, difficulty = 'mid') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('difficulty', difficulty);
    const response = await api.post('/upload-resume', formData);
    return response.data;
};

export const startInterview = async () => {
    const response = await api.post('/start-interview');
    return response.data;
};

export const submitAnswer = async (answer) => {
    const response = await api.post('/answer', { answer });
    return response.data;
};

export const getSummary = async () => {
    const response = await api.get('/interview-summary');
    return response.data;
};

export default api;
