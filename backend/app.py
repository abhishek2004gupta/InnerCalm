# app.py

import nltk
import numpy as np
import random
import json
import pickle
import os
import traceback

from nltk.stem.lancaster import LancasterStemmer
from keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Init Flask
app = Flask(__name__)
CORS(app)

# Load data
stemmer = LancasterStemmer()
with open('/data/dataset.json') as file:
    intents = json.load(file)

model = load_model('chatbot_model.keras')
data = pickle.load(open("training_data.pkl", "rb"))
words = data['words']
classes = data['classes']

# NLP helper functions
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words, show_details=False):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

# Prediction
ERROR_THRESHOLD = 0.30

def classify(sentence):
    results = model.predict(np.array([bow(sentence, words)]), verbose=0)[0]
    results = [[i, r] for i, r in enumerate(results) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return [(classes[r[0]], r[1]) for r in results]

def response(sentence, userID='123'):
    results = classify(sentence)
    if results:
        for i in intents['intents']:
            if i['tag'] == results[0][0]:
                return random.choice(i['responses'])
    return "I'm not sure how to respond to that."

# Routes
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    bot_response = response(user_message)
    return jsonify({'response': bot_response})

@app.route('/api/gemini-summary', methods=['POST'])
def gemini_summary():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        if not messages:
            return jsonify({'error': 'No messages provided'}), 400

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

        # Gemini setup
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return jsonify({'error': 'Gemini API key not set'}), 500

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        chat = model.start_chat()

        summary_result = chat.send_message(summary_prompt)
        suggestions_result = chat.send_message(suggestions_prompt)

        return jsonify({
            'summary': summary_result.text,
            'suggestions': suggestions_result.text
        })

    except Exception as e:
        traceback.print_exc()  # Print full error in terminal
        return jsonify({'error': str(e)}), 500

# Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
