const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const VBEE_API_URL = "https://vbee.vn/api/v1/tts"; 
const APP_ID = "bfe6d5b6-d0b8-46ac-8fd2-15d002ca8ead"; 
const TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzA2MzIzNTl9.2KNZ_y8i4D1jQ5pdOZznnHPMtp_97MvSN4JiPR0zIEg";

app.get('/esp32-tts', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ status: 0, message: "Missing text" });

    try {
        const vbeeRes = await axios.post(VBEE_API_URL, {
            app_id: APP_ID,
            input_text: text,
            voice_code: "hn_female_ngochuyen_full_48k-fhg",
            audio_type: "mp3",
            response_type: "direct"
        }, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });

        // Lấy dữ liệu từ Vbee
        const vbeeData = vbeeRes.data.result;

        if (vbeeData && vbeeData.audio_link) {
            // Trả về đúng cấu trúc JSON bạn yêu cầu
            res.status(200).json({
                result: {
                    app_id: vbeeData.app_id,
                    audio_link: vbeeData.audio_link, // Link HTTPS trực tiếp
                    audio_type: vbeeData.audio_type,
                    bitrate: vbeeData.bitrate,
                    characters: text.length,
                    request_id: vbeeData.request_id,
                    speed_rate: vbeeData.speed_rate || 1,
                    status: "SUCCESS",
                    voice_code: vbeeData.voice_code
                },
                status: 1
            });
        } else {
            res.status(500).json({ status: 0, message: "Vbee did not return audio link" });
        }

    } catch (error) {
        res.status(500).json({ status: 0, error: error.message });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server JSON chuẩn Vbee đang chạy tại http://192.168.1.2:3000");
});