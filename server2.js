const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs'); // 파일 시스템 모듈 추가

const app = express();
const PORT = 3000;

// MongoDB 연결 설정 (환경 변수 사용)
mongoose.connect('몽고DB API연결')
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
        // 문자열을 Base64로 인코딩
        const encodedText = Buffer.from(receivedText).toString('base64');

        // MongoDB에 원본 텍스트 저장
        const newText = new TextModel({ text: receivedText });
        newText.save()
            .then(() => {
                // 인코딩된 텍스트를 파일로 저장
                fs.writeFile('encoded_text.txt', encodedText, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to file', err);
                        return res.status(500).json({ message: 'Error saving to file', error: err });
                    }
                    console.log('Encoded text successfully written to encoded_text.txt');
                    res.json({ message: 'Text received, encoded, saved successfully, and written to file', encodedText });
                });
            })
            .catch(err => res.status(500).json({ message: 'Error saving to database', error: err }));
    } else {
        res.status(400).json({ message: 'Bad Request: Text is required' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
