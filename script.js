async function makePrediction() {
    const inputElement = document.getElementById('text-input');
    const modelSelect = document.getElementById('model-select');
    const resultElement = document.getElementById('result');

    // Lấy dữ liệu input từ người dùng
    const textInput = inputElement.value.trim();
    const selectedModel = modelSelect.value;

    if (!textInput) {
        resultElement.innerHTML = "Please enter some text!";
        return;
    }

    // Gọi API Flask
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textInput, model: selectedModel }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        resultElement.innerHTML = `Prediction: ${data.prediction}`;
    } catch (error) {
        resultElement.innerHTML = `Error: ${error.message}`;
    }
}

async function fetchMetrics() {
    const modelSelect = document.getElementById('model-select');
    const metricsDisplay = document.getElementById('metrics-display');
    const selectedModel = modelSelect.value;

    metricsDisplay.innerHTML = '<p>Loading metrics...</p>';
    try {
        const response = await fetch(`http://127.0.0.1:5000/metrics?model=${selectedModel}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        metricsDisplay.innerHTML = `
            <p><strong>Accuracy:</strong> ${(data.accuracy * 100).toFixed(2)}%</p>
            <p><strong>Precision:</strong> ${(data.precision * 100).toFixed(2)}%</p>
            <p><strong>Recall:</strong> ${(data.recall * 100).toFixed(2)}%</p>
            <p><strong>F1 Score:</strong> ${(data.f1_score * 100).toFixed(2)}%</p>
        `;
    } catch (error) {
        metricsDisplay.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    fetchMetrics(); // Hiển thị chỉ số của mô hình mặc định khi trang mở
});