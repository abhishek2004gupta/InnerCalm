# Model Directory Structure

This directory contains all the machine learning models used in the InnerCalm application.

## Directory Structure

```
models/
├── chatbot/              # Chatbot model directory
│   ├── model.pkl        # Trained chatbot model
│   └── training_data.pkl # Training data for the model
```

## Model Information

### Chatbot Model
- **File**: `chatbot/model.pkl`
- **Type**: Trained model for mental health conversation
- **Last Updated**: [Date]
- **Version**: 1.0
- **Dependencies**: 
  - scikit-learn
  - numpy
  - pandas

### Training Data
- **File**: `chatbot/training_data.pkl`
- **Description**: Preprocessed training data for the chatbot model
- **Format**: Pickle file containing processed conversations
- **Size**: [Size in MB]

## Usage

The models are loaded and used by the Flask application in `app.py`. The model loading process is handled by the `ModelManager` class.

## Backup

Regular backups of the models and training data should be maintained. The backup process is automated and stored in the `backup/` directory.

## Security

- Models and training data are not committed to version control
- Access to model files is restricted
- Regular security audits are performed 