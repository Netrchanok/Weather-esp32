const express = require('express');
const router = express.Router();

// ใช้ In-memory storage เพื่อความง่ายในการสาธิต
// ใน Production ควรใช้ Database เช่น Redis หรือ MongoDB
let latestSensorData = {
    temperature: null,
    humidity: null,
    timestamp: null
};

/**
 * @route   POST /api/sensor/data
 * @desc    รับข้อมูลจาก ESP32
 * @access  Public
 */
router.post('/data', (req, res) => {
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ success: false, message: 'Missing temperature or humidity data.' });
    }

    latestSensorData = {
        temperature: parseFloat(temperature).toFixed(1),
        humidity: parseFloat(humidity).toFixed(1),
        timestamp: new Date()
    };

    console.log('Received sensor data:', latestSensorData);
    // ส่งข้อมูลไปยัง client ที่เชื่อมต่อผ่าน WebSocket (ถ้ามี)
    // io.emit('sensor-update', latestSensorData);
    res.status(200).json({ success: true, message: 'Data received successfully.' });
});

/**
 * @route   GET /api/sensor/data
 * @desc    ส่งข้อมูลล่าสุดให้ Frontend
 * @access  Public
 */
router.get('/data', (req, res) => {
    if (latestSensorData.timestamp) {
        res.json({ success: true, data: latestSensorData });
    } else {
        res.json({ success: false, message: 'No sensor data available yet.' });
    }
});

module.exports = router;