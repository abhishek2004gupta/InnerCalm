# # app.py

# import nltk
# import numpy as np
# import random
# import json
# import pickle
# import os
# import traceback
# import logging
# from pathlib import Path

# from nltk.stem.lancaster import LancasterStemmer
# from keras.models import load_model
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from dotenv import load_dotenv
# import google.generativeai as genai
# from model_manager import ModelManager

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load environment variables
# load_dotenv()

# # Init Flask
# app = Flask(__name__)
# CORS(app)

# # Configure Gemini API
# genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
# model = genai.GenerativeModel('gemini-pro')

# # Initialize model manager
# model_manager = ModelManager()

# # Get the current directory
# current_dir = Path(__file__).parent

# try:
#     # Load data
#     stemmer = LancasterStemmer()
#     dataset_path = current_dir/'dataset.json'
#     training_data_path = current_dir / 'models' / 'chatbot' / 'training_data.pkl'
    
#     if not dataset_path.exists():
#         logger.error(f"Dataset file not found at {dataset_path}")
#         raise FileNotFoundError(f"Dataset file not found at {dataset_path}")
        
#     if not training_data_path.exists():
#         logger.error(f"Training data file not found at {training_data_path}")
#         raise FileNotFoundError(f"Training data file not found at {training_data_path}")
    
#     with open(dataset_path) as file:
#         intents = json.load(file)
    
#     data = pickle.load(open(training_data_path, "rb"))
#     words = data['words']
#     classes = data['classes']
    
#     logger.info("Successfully loaded dataset and training data")
# except Exception as e:
#     logger.error(f"Error loading data: {str(e)}")
#     raise

# # NLP helper functions
# def clean_up_sentence(sentence):
#     sentence_words = nltk.word_tokenize(sentence)
#     sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
#     return sentence_words

# def bow(sentence, words, show_details=False):
#     sentence_words = clean_up_sentence(sentence)
#     bag = [0] * len(words)
#     for s in sentence_words:
#         for i, w in enumerate(words):
#             if w == s:
#                 bag[i] = 1
#     return np.array(bag)

# # Prediction
# ERROR_THRESHOLD = 0.30

# def classify(sentence):
#     results = model.predict(np.array([bow(sentence, words)]), verbose=0)[0]
#     results = [[i, r] for i, r in enumerate(results) if r > ERROR_THRESHOLD]
#     results.sort(key=lambda x: x[1], reverse=True)
#     return [(classes[r[0]], r[1]) for r in results]

# def response(sentence, userID='123'):
#     results = classify(sentence)
#     if results:
#         for i in intents['intents']:
#             if i['tag'] == results[0][0]:
#                 return random.choice(i['responses'])
#     return "I'm not sure how to respond to that."

# @app.route('/health', methods=['GET'])
# def health_check():
#     """Health check endpoint."""
#     return jsonify({'status': 'healthy'})

# @app.route('/generate_summary', methods=['POST'])
# def generate_summary():
#     """Generate a summary of the conversation."""
#     try:
#         data = request.json
#         messages = data.get('messages', [])
        
#         # Format messages for Gemini
#         conversation = "\n".join([f"{msg['sender_type']}: {msg['message_text']}" for msg in messages])
        
#         # Generate summary
#         prompt = f"""Based on this conversation, provide a detailed summary focusing on:
#         1. Main topics discussed
#         2. Emotional state of the user
#         3. Key concerns or issues raised
#         4. Progress made in the conversation

#         Conversation:
#         {conversation}

#         Please provide a professional and empathetic summary."""
        
#         response = model.generate_content(prompt)
#         summary = response.text
        
#         return jsonify({'summary': summary})
#     except Exception as e:
#         logger.error(f"Error generating summary: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/generate_suggestions', methods=['POST'])
# def generate_suggestions():
#     """Generate suggestions based on the conversation."""
#     try:
#         data = request.json
#         messages = data.get('messages', [])
        
#         # Format messages for Gemini
#         conversation = "\n".join([f"{msg['sender_type']}: {msg['message_text']}" for msg in messages])
        
#         # Generate suggestions
#         prompt = f"""Based on this conversation, provide 3-5 specific, actionable suggestions for:
#         1. Coping strategies
#         2. Self-care activities
#         3. Professional resources if needed
#         4. Next steps for improvement

#         Conversation:
#         {conversation}

#         Please provide practical and supportive suggestions."""
        
#         response = model.generate_content(prompt)
#         suggestions = response.text
        
#         return jsonify({'suggestions': suggestions})
#     except Exception as e:
#         logger.error(f"Error generating suggestions: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/chat', methods=['POST'])
# def chat():
#     """Handle chat messages and generate responses."""
#     try:
#         data = request.json
#         message = data.get('message', '')
#         # Generate response using the model manager's generate_response
#         response = model_manager.generate_response(message)
#         return jsonify({'response': response})
#     except Exception as e:
#         logger.error(f"Error in chat endpoint: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     # Download required NLTK data
#     try:
#         nltk.data.find('tokenizers/punkt')
#     except LookupError:
#         nltk.download('punkt')
    
#     # Start the Flask application
#     app.run(host='0.0.0.0', port=5001)


# app.py

import nltk
import numpy as np
import random
import json
import pickle
import os
import traceback
import logging
from pathlib import Path

from nltk.stem.lancaster import LancasterStemmer
from keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from model_manager import ModelManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Init Flask
app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize ModelManager
model_manager = ModelManager()

# Load NLTK model and data
stemmer = LancasterStemmer()
current_dir = Path(__file__).parent
dataset_path = current_dir/'data' / 'dataset.json'
training_data_path = current_dir / 'models' / 'chatbot' / 'training_data.pkl'
keras_model_path = current_dir / 'models' / 'chatbot' / 'chatbot_model.keras'

try:
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset file not found at {dataset_path}")
    if not training_data_path.exists():
        raise FileNotFoundError(f"Training data file not found at {training_data_path}")
    if not keras_model_path.exists():
        raise FileNotFoundError(f"Keras model not found at {keras_model_path}")

    with open(dataset_path) as file:
        intents = json.load(file)

    data = pickle.load(open(training_data_path, "rb"))
    words = data['words']
    classes = data['classes']
    keras_model = load_model(keras_model_path)

    logger.info("Successfully loaded chatbot model and training data.")
except Exception as e:
    logger.error(f"Error loading model/data: {str(e)}")
    raise

# NLP Helper Functions
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    return [stemmer.stem(word.lower()) for word in sentence_words]

def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [1 if w in sentence_words else 0 for w in words]
    return np.array(bag)

# Classification
ERROR_THRESHOLD = 0.30

def classify(sentence):
    results = keras_model.predict(np.array([bow(sentence, words)]), verbose=0)[0]
    results = [[i, r] for i, r in enumerate(results) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return [(classes[r[0]], r[1]) for r in results]

def legacy_response(sentence):
    results = classify(sentence)
    if results:
        for i in intents['intents']:
            if i['tag'] == results[0][0]:
                return random.choice(i['responses'])
    return "I'm not sure how to respond to that."

# Health Check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

# ✅ Chat Endpoint
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Use model manager (default) or switch to legacy_response(message)
        response = model_manager.generate_response(message)

        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in /api/chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ✅ Gemini Summary + Suggestions Endpoint
@app.route('/api/gemini-summary', methods=['POST'])
def gemini_summary():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        if not messages:
            return jsonify({'error': 'No messages provided'}), 400

        # Format messages
        formatted_messages = '\n'.join([
            f"{msg['sender'].capitalize()}: {msg['text']}" for msg in messages
        ])

        summary_prompt = f"""
Please analyze this mental health conversation and provide:
1. A concise summary of the main topics discussed
2. Key points or concerns raised by the user
3. The overall emotional tone of the conversation

Conversation:
{formatted_messages}
"""

        suggestions_prompt = f"""
Based on this mental health conversation, please provide:
1. Professional suggestions for the user's well-being
2. Recommended resources or activities that might help
3. Any potential warning signs or concerns that should be addressed

Conversation:
{formatted_messages}
"""

        summary_result = gemini_model.start_chat().send_message(summary_prompt)
        suggestions_result = gemini_model.start_chat().send_message(suggestions_prompt)

        return jsonify({
            'summary': summary_result.text,
            'suggestions': suggestions_result.text
        })
    except Exception as e:
        logger.error(f"Error in /api/gemini-summary: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ✅ Run Flask App on Port 5001
if __name__ == '__main__':
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')

    app.run(debug=True, port=5001)
