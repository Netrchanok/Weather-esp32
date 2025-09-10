const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const weatherRoutes = require('./routes/weather');
const sensorRoutes = require('./routes/sensor'); // << เพิ่ม route สำหรับ sensor

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // << สำคัญมาก: สำหรับรับ JSON body จาก ESP32
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/sensor', sensorRoutes); // << เรียกใช้ sensor route

// Serve the main HTML file for any other routes not handled by the API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Ready to accept connections from any IP address.');
});

// เพิ่มการจัดการข้อผิดพลาดพื้นฐาน
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});