from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    try:
        data = request.json
        messages = data.get('messages', [])
        
        # Format messages for Gemini
        conversation = "\n".join([f"{msg['sender_type']}: {msg['message_text']}" for msg in messages])
        
        # Generate summary
        prompt = f"""Based on this conversation, provide a detailed summary focusing on:
        1. Main topics discussed
        2. Emotional state of the user
        3. Key concerns or issues raised
        4. Progress made in the conversation

        Conversation:
        {conversation}

        Please provide a professional and empathetic summary."""
        
        response = model.generate_content(prompt)
        summary = response.text
        
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_suggestions', methods=['POST'])
def generate_suggestions():
    try:
        data = request.json
        messages = data.get('messages', [])
        
        # Format messages for Gemini
        conversation = "\n".join([f"{msg['sender_type']}: {msg['message_text']}" for msg in messages])
        
        # Generate suggestions
        prompt = f"""Based on this conversation, provide 3-5 specific, actionable suggestions for:
        1. Coping strategies
        2. Self-care activities
        3. Professional resources if needed
        4. Next steps for improvement

        Conversation:
        {conversation}

        Please provide practical and supportive suggestions."""
        
        response = model.generate_content(prompt)
        suggestions = response.text
        
        return jsonify({'suggestions': suggestions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001) 