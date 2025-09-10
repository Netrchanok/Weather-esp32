// api/weather.js
export default async function handler(req, res) {
  try {
    const { city, lat, lon } = req.query;

    const apiKey = process.env.OPENWEATHER_API_KEY;

    let url = "";
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=th`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;
    } else {
      return res.status(400).json({ error: "กรุณาระบุ city หรือ lat/lon" });
    }

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
}

