import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const PYTHON_BACKEND_URL = process.env.REACT_APP_PYTHON_BACKEND_URL || 'http://localhost:5001';

export const generateChatSummary = async (chatMessages) => {
  const response = await fetch(`${PYTHON_BACKEND_URL}/api/gemini-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatMessages }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.summary;
};

export const generateSuggestions = async (chatMessages) => {
  const response = await fetch(`${PYTHON_BACKEND_URL}/api/gemini-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatMessages }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.suggestions;
}; 