import os
import json
import pickle
import numpy as np
import random
import logging
from pathlib import Path
from tensorflow import keras
# import nltk
# try:
#     nltk.data.find('tokenizers/punkt')
# except LookupError:
#     nltk.download('punkt')

class ModelManager:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.model = None
        self.words = None
        self.classes = None
        self.intents = None
        base = Path(__file__).parent / 'models' / 'chatbot'
        self.model_path = base / 'chatbot_model.keras'
        self.data_path = base / 'training_data.pkl'
        self.intents_path = Path(__file__).parent.parent / 'python' / 'data' / 'dataset.json'
        self.ERROR_THRESHOLD = 0.30

    def load_model(self):
        """Load the chatbot Keras model from disk."""
        try:
            if not self.model_path.exists():
                self.logger.error(f"Keras model file not found at {self.model_path}")
                return False
            self.model = keras.models.load_model(self.model_path)
            self.logger.info("Keras model loaded successfully")
            return True
        except Exception as e:
            self.logger.error(f"Error loading Keras model: {str(e)}")
            return False

    def load_training_data(self):
        try:
            if not self.data_path.exists():
                self.logger.error(f"Training data file not found at {self.data_path}")
                return False
            with open(self.data_path, 'rb') as f:
                data = pickle.load(f)
            self.words = data['words']
            self.classes = data['classes']
            self.logger.info("Training data loaded successfully")
            return True
        except Exception as e:
            self.logger.error(f"Error loading training data: {str(e)}")
            return False

    def load_intents(self):
        try:
            if not self.intents_path.exists():
                self.logger.error(f"Intents file not found at {self.intents_path}")
                return False
            with open(self.intents_path, 'r') as f:
                self.intents = json.load(f)
            self.logger.info("Intents loaded successfully")
            return True
        except Exception as e:
            self.logger.error(f"Error loading intents: {str(e)}")
            return False

    def ensure_loaded(self):
        if self.model is None:
            self.load_model()
        if self.words is None or self.classes is None:
            self.load_training_data()
        if self.intents is None:
            self.load_intents()

    def clean_up_sentence(self, sentence):
        # import nltk
        from nltk.stem.lancaster import LancasterStemmer
        stemmer = LancasterStemmer()
        # sentence_words = nltk.word_tokenize(sentence)
        sentence_words = sentence.split()
        sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
        return sentence_words

    def bow(self, sentence, words):
        sentence_words = self.clean_up_sentence(sentence)
        bag = [0] * len(words)
        for s in sentence_words:
            for i, w in enumerate(words):
                if w == s:
                    bag[i] = 1
        return np.array(bag)

    def classify(self, sentence):
        self.ensure_loaded()
        results = self.model.predict(np.array([self.bow(sentence, self.words)]), verbose=0)[0]
        results = [[i, r] for i, r in enumerate(results) if r > self.ERROR_THRESHOLD]
        results.sort(key=lambda x: x[1], reverse=True)
        return [(self.classes[r[0]], r[1]) for r in results]

    def generate_response(self, sentence):
        self.ensure_loaded()
        results = self.classify(sentence)
        if results:
            for i in self.intents['intents']:
                if i['tag'] == results[0][0]:
                    return random.choice(i['responses'])
        return "I'm not sure how to respond to that." 