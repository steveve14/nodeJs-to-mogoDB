// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Schema 및 Model 정의
const textSchema = new mongoose.Schema({
    text: String,
    date: { type: Date, default: Date.now }
});

const TextModel = mongoose.model('Text', textSchema);

// JSON 요청을 파싱하기 위한 미들웨어
app.use(bodyParser.json());

app.post('/api/endpoint', (req, res) => {
    const receivedText = req.body.text; // JSON의 "text" 필드 추출
    console.log('Received text:', receivedText);
    if (receivedText) {
        // MongoDB에 텍스트 저장
        const newText = new TextModel({ text: receivedText });
        newText.save()
            .then(() => res.json({ message: 'Text received and saved successfully', receivedText }))
            .catch(err => res.status(500).json({ message: 'Error saving to database', error: err }));
    } else {
        res.status(400).json({ message: 'Bad Request: Text is required' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
