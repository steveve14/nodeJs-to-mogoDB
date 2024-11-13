// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// JSON 요청을 파싱하기 위한 미들웨어
app.use(bodyParser.json());

app.post('/api/endpoint', (req, res) => {
    const receivedText = req.body.text; // JSON의 "text" 필드 추출
    console.log('Received text:', receivedText);
    if (receivedText) {
        res.json({ message: 'Text received successfully', receivedText });
    } else {
        res.status(400).json({ message: 'Bad Request: Text is required' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
