from flask import Flask, render_template, request, jsonify
import subprocess
import torch
from backend import text_to_speech, speech_to_text, tokenizer, model, dataset

app = Flask(__name__)

# Route to open the command prompt
@app.route('/open-cmd', methods=['GET'])
def open_cmd():
    try:
        subprocess.Popen('start cmd', shell=True)  # Open command prompt in Windows
        return jsonify(success=True), 200
    except Exception as e:
        print(f"Error opening command prompt: {e}")
        return jsonify(success=False), 500

# Home Route
@app.route("/")
def home():
    return render_template("services.ejs")  # Adjusted path to match your file structure

# API Endpoint for Chat
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()  # Receive user input as JSON
    user_input = data.get("message", "")

    # Process user input using the backend
    if user_input.lower() == "exit":
        exit_greet = "Feel free to reach out anytime, later. Thank you!!"
        text_to_speech(exit_greet)
        return jsonify({"response": exit_greet})

    # Predict response using the model
    encoded = torch.tensor(tokenizer.encode(user_input)).unsqueeze(0)
    output = model(encoded)
    predicted_label = torch.argmax(output, dim=1)
    tag = dataset.labels.inverse_transform(predicted_label.cpu().numpy())[0]

    # Find appropriate response
    for intent in intents:
        if intent["tag"] == tag:
            response = random.choice(intent["responses"])
            text_to_speech(response)
            return jsonify({"response": response})

    return jsonify({"response": "Sorry, I couldn't understand that."})

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)

# from flask import Flask, render_template, request, jsonify
# import subprocess
# import torch
# import random
# from backend import text_to_speech, speech_to_text, tokenizer, model, dataset, intents

# app = Flask(__name__)

# # Route to open the command prompt
# @app.route('/open-cmd', methods=['GET'])
# def open_cmd():
#     try:
#         subprocess.Popen('start cmd', shell=True)  # Open command prompt in Windows
#         return jsonify(success=True), 200
#     except Exception as e:
#         print(f"Error opening command prompt: {e}")
#         return jsonify(success=False), 500

# # Home Route
# @app.route("/")
# def home():
#     return render_template("services.ejs")  # Ensure this file exists in the templates folder

# # API Endpoint for Chat
# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.get_json()  # Receive user input as JSON
#     user_input = data.get("message", "")

#     # Speech-to-text conversion
#     if user_input.lower() == "speak":
#         user_input = speech_to_text()  # Get text from the user's voice input
#         if not user_input:
#             return jsonify({"response": "I couldn't understand your audio input.", "user_text": ""})

#     # Process user input using the backend
#     if user_input.lower() == "exit":
#         exit_greet = "Feel free to reach out anytime, later. Thank you!!"
#         text_to_speech(exit_greet)
#         return jsonify({"response": exit_greet, "user_text": user_input})

#     # Predict response using the model
#     encoded = torch.tensor(tokenizer.encode(user_input)).unsqueeze(0)
#     output = model(encoded)
#     predicted_label = torch.argmax(output, dim=1)
#     tag = dataset.labels.inverse_transform(predicted_label.cpu().numpy())[0]

#     # Find appropriate response
#     for intent in intents:
#         if intent["tag"] == tag:
#             response = random.choice(intent["responses"])
#             text_to_speech(response)
#             return jsonify({"response": response, "user_text": user_input})

#     return jsonify({"response": "Sorry, I couldn't understand that.", "user_text": user_input})


# if __name__ == "__main__":
#     app.run(debug=True, host='127.0.0.1', port=5000)
