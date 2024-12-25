from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


models = {
    "model1": joblib.load('model.joblib'),
    "model2": joblib.load('model_DecisionTree.joblib'),
    "model3": joblib.load('model_RandomForest.joblib'),
    "model4": joblib.load('model_SVM.joblib'),
    "model5": joblib.load('model_LogisticRegression.joblib')
}

test_data = pd.read_csv('LanguageDetection.csv') 
X = test_data['Text']
y = test_data['Language']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
# Khởi tạo ứng dụng Flask
app = Flask(__name__)
CORS(app)  # Kích hoạt CORS

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text_input = data.get('text')
    selected_model = data.get('model')  # Lấy model từ request
    
    if not text_input:
        return jsonify({'error': 'No text input provided'}), 400
    
    if selected_model not in models:
        return jsonify({'error': f'Model {selected_model} not found'}), 400

    # Dự đoán với model được chọn
    prediction = models[selected_model].predict([text_input])
    return jsonify({'prediction': prediction.tolist()})

@app.route('/metrics', methods=['GET'])
def calculate_metrics():
    selected_model_name = request.args.get('model')  # Default to model1
    if not selected_model_name or selected_model_name not in models:
        return jsonify({'error': f'Model {selected_model_name} not found'}), 400

    model = models[selected_model_name]

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=1)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=1)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=1)

    return jsonify({
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1
        })

if __name__ == '__main__':
    app.run(debug=True)
