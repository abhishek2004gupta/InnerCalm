# Import required libraries
import nltk
import numpy as np
import random
import json
import pickle
import os

# Set the custom NLTK data path
nltk.data.path.append('/content/nltk_data')

# Download only if necessary
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', download_dir='/content/nltk_data')

nltk.download('punkt_tab', download_dir='/content/nltk_data')
nltk.download('wordnet', download_dir='/content/nltk_data')
nltk.download('stopwords', download_dir='/content/nltk_data')

from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

# Load intents file
with open('dataset.json') as file:
    intents = json.load(file)

words = []
classes = []
documents = []
ignore_words = ['?']

# Tokenize and stem patterns
for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [stemmer.stem(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

# Training data
training = []
output_empty = [0] * len(classes)

for doc in documents:
    bag = []
    pattern_words = [stemmer.stem(word.lower()) for word in doc[0]]
    for w in words:
        bag.append(1 if w in pattern_words else 0)

    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training, dtype=object)
train_x = np.array(list(training[:, 0]))
train_y = np.array(list(training[:, 1]))

# Save words and classes
pickle.dump({'words': words, 'classes': classes, 'train_x': train_x, 'train_y': train_y}, open("training_data.pkl", "wb"))

# Build the model using Keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Build improved model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.3))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.3))
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile with better optimizer
optimizer = Adam(learning_rate=0.001)
model.compile(loss='categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

# Train the model
model.fit(train_x, train_y, epochs=230, batch_size=6, verbose=1)

# Save the trained model
model.save('chatbot_model.keras')


# import json
# import numpy as np
# import random
# import pickle
# from tensorflow.keras.preprocessing.text import Tokenizer
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
# from sklearn.preprocessing import LabelEncoder

# # Load dataset
# with open("dataset.json") as file:
#     data = json.load(file)

# sentences = []
# labels = []

# for intent in data["intents"]:
#     for pattern in intent["patterns"]:
#         sentences.append(pattern)
#         labels.append(intent["tag"])

# # Encode labels
# label_encoder = LabelEncoder()
# labels_encoded = label_encoder.fit_transform(labels)

# # Tokenize sentences
# vocab_size = 10000
# oov_token = "<OOV>"
# tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_token)
# tokenizer.fit_on_texts(sentences)
# sequences = tokenizer.texts_to_sequences(sentences)

# # Pad sequences
# max_len = max(len(seq) for seq in sequences)
# padded_sequences = pad_sequences(sequences, maxlen=max_len, padding='post')

# # Convert labels to one-hot
# num_classes = len(set(labels))
# train_y = np.zeros((len(labels_encoded), num_classes))
# for i, label in enumerate(labels_encoded):
#     train_y[i][label] = 1

# # Save tokenizer and label encoder
# pickle.dump(tokenizer, open("tokenizer.pkl", "wb"))
# pickle.dump(label_encoder, open("label_encoder.pkl", "wb"))

# # Build the model
# model = Sequential()
# model.add(Embedding(vocab_size, 128, input_length=max_len))
# model.add(LSTM(128, return_sequences=True))
# model.add(Dropout(0.3))
# model.add(LSTM(64))
# model.add(Dense(64, activation='relu'))
# model.add(Dropout(0.3))
# model.add(Dense(num_classes, activation='softmax'))

# model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# # Train the model
# model.fit(padded_sequences, train_y, epochs=50, batch_size=8, verbose=1)

# # Save model
# model.save("chatbot_model.keras")
