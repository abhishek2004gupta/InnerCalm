const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// Create a new chat session
export const createChatSession = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_URL}/chat/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to create chat session');
    
    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Create chat session error:', error);
    throw error;
  }
};



// End a chat session
export const endChatSession = async (sessionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_URL}/chat/session/${sessionId}/end`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to end chat session');
    
    return true;
  } catch (error) {
    console.error('End chat session error:', error);
    throw error;
  }
};

// Save chat summary
export const saveChatSummary = async (sessionId, enhancedSummary, suggestions) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_URL}/chat/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionId,
        enhancedSummary,
        suggestions
      })
    });

    if (!response.ok) throw new Error('Failed to save summary');
    
    const data = await response.json();
    return data.summaryId;
  } catch (error) {
    console.error('Save chat summary error:', error);
    throw error;
  }
};



// Get user's chat sessions
export const getChatSessions = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_URL}/chat/sessions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to get sessions');
    
    const data = await response.json();
    return data.sessions;
  } catch (error) {
    console.error('Get chat sessions error:', error);
    throw error;
  }
}; 