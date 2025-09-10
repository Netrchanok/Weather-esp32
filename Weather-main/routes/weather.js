const express = require("express");
const axios = require("axios");
const router = express.Router();

// Thai provinces data for location selection - ทั้งหมด 77 จังหวัด
const thaiProvinces = [
  // ภาคเหนือ (Northern Thailand)
  {
    name: "เชียงใหม่",
    en: "Chiang Mai",
    lat: 18.7883,
    lon: 98.9853,
    region: "ภาคเหนือ",
  },
  {
    name: "เชียงราย",
    en: "Chiang Rai",
    lat: 19.9105,
    lon: 99.8406,
    region: "ภาคเหนือ",
  },
  {
    name: "ลำปาง",
    en: "Lampang",
    lat: 18.2928,
    lon: 99.4908,
    region: "ภาคเหนือ",
  },
  {
    name: "ลำพูน",
    en: "Lamphun",
    lat: 18.5797,
    lon: 99.0103,
    region: "ภาคเหนือ",
  },
  {
    name: "แม่ฮ่องสอน",
    en: "Mae Hong Son",
    lat: 19.3014,
    lon: 97.9659,
    region: "ภาคเหนือ",
  },
  { name: "น่าน", en: "Nan", lat: 18.7838, lon: 100.7747, region: "ภาคเหนือ" },
  {
    name: "พะเยา",
    en: "Phayao",
    lat: 19.1923,
    lon: 99.8732,
    region: "ภาคเหนือ",
  },
  {
    name: "แพร่",
    en: "Phrae",
    lat: 18.1447,
    lon: 100.1409,
    region: "ภาคเหนือ",
  },
  {
    name: "อุตรดิตถ์",
    en: "Uttaradit",
    lat: 17.6204,
    lon: 100.0995,
    region: "ภาคเหนือ",
  },

  // ภาคตะวันออกเหนือ (Northeastern Thailand/Isan)
  {
    name: "กาฬสินธุ์",
    en: "Kalasin",
    lat: 16.4322,
    lon: 103.5063,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "ขอนแก่น",
    en: "Khon Kaen",
    lat: 16.4419,
    lon: 102.8359,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "นครพนม",
    en: "Nakhon Phanom",
    lat: 17.4054,
    lon: 104.7686,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "นครราชสีมา",
    en: "Nakhon Ratchasima",
    lat: 14.9799,
    lon: 102.0977,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "บึงกาฬ",
    en: "Bueng Kan",
    lat: 18.3563,
    lon: 103.6464,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "บุรีรัมย์",
    en: "Buriram",
    lat: 14.993,
    lon: 103.1028,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "มหาสารคาม",
    en: "Maha Sarakham",
    lat: 16.1851,
    lon: 103.2998,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "มุกดาหาร",
    en: "Mukdahan",
    lat: 16.5446,
    lon: 104.7233,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "ยศธร",
    en: "Yasothon",
    lat: 15.7881,
    lon: 104.1452,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "ร้อยเอ็ด",
    en: "Roi Et",
    lat: 16.0514,
    lon: 103.6537,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "เลย",
    en: "Loei",
    lat: 17.486,
    lon: 101.7223,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "ศรีสะเกษ",
    en: "Sisaket",
    lat: 15.1186,
    lon: 104.3221,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "สกลนคร",
    en: "Sakon Nakhon",
    lat: 17.1616,
    lon: 104.1486,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "สุรินทร์",
    en: "Surin",
    lat: 14.8818,
    lon: 103.4933,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "หนองคาย",
    en: "Nong Khai",
    lat: 17.8782,
    lon: 102.7412,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "หนองบัวลำภู",
    en: "Nong Bua Lam Phu",
    lat: 17.2042,
    lon: 102.4304,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "อำนาจเจริญ",
    en: "Amnat Charoen",
    lat: 15.8651,
    lon: 104.6296,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "อุดรธานี",
    en: "Udon Thani",
    lat: 17.4138,
    lon: 102.7877,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "อุบลราชธานี",
    en: "Ubon Ratchathani",
    lat: 15.2448,
    lon: 104.8472,
    region: "ภาคตะวันออกเหนือ",
  },
  {
    name: "ชัยภูมิ",
    en: "Chaiyaphum",
    lat: 15.8067,
    lon: 102.031,
    region: "ภาคตะวันออกเหนือ",
  },

  // ภาคกลาง (Central Thailand)
  {
    name: "กรุงเทพมหานคร",
    en: "Bangkok",
    lat: 13.7563,
    lon: 100.5018,
    region: "ภาคกลาง",
  },
  {
    name: "กำแพงเพชร",
    en: "Kamphaeng Phet",
    lat: 16.4827,
    lon: 99.5225,
    region: "ภาคกลาง",
  },
  {
    name: "ชัยนาท",
    en: "Chai Nat",
    lat: 15.1851,
    lon: 100.1251,
    region: "ภาคกลาง",
  },
  {
    name: "นครนายก",
    en: "Nakhon Nayok",
    lat: 14.2069,
    lon: 101.213,
    region: "ภาคกลาง",
  },
  {
    name: "นครปฐม",
    en: "Nakhon Pathom",
    lat: 13.8199,
    lon: 100.0449,
    region: "ภาคกลาง",
  },
  {
    name: "นครสวรรค์",
    en: "Nakhon Sawan",
    lat: 15.6958,
    lon: 100.1372,
    region: "ภาคกลาง",
  },
  {
    name: "นนทบุรี",
    en: "Nonthaburi",
    lat: 13.8621,
    lon: 100.5144,
    region: "ภาคกลาง",
  },
  {
    name: "ปทุมธานี",
    en: "Pathum Thani",
    lat: 14.0208,
    lon: 100.525,
    region: "ภาคกลาง",
  },
  {
    name: "พระนครศรีอยุธยา",
    en: "Phra Nakhon Si Ayutthaya",
    lat: 14.3692,
    lon: 100.5877,
    region: "ภาคกลาง",
  },
  {
    name: "พิจิตร",
    en: "Phichit",
    lat: 16.439,
    lon: 100.3491,
    region: "ภาคกลาง",
  },
  {
    name: "พิษณุโลก",
    en: "Phitsanulok",
    lat: 16.811,
    lon: 100.2559,
    region: "ภาคกลาง",
  },
  {
    name: "เพชรบูรณ์",
    en: "Phetchabun",
    lat: 16.4193,
    lon: 101.1603,
    region: "ภาคกลาง",
  },
  {
    name: "ลพบุรี",
    en: "Lopburi",
    lat: 14.7995,
    lon: 100.6533,
    region: "ภาคกลาง",
  },
  {
    name: "สมุทรปราการ",
    en: "Samut Prakan",
    lat: 13.5991,
    lon: 100.5998,
    region: "ภาคกลาง",
  },
  {
    name: "สมุทรสงคราม",
    en: "Samut Songkhram",
    lat: 13.4096,
    lon: 100.0023,
    region: "ภาคกลาง",
  },
  {
    name: "สมุทรสาคร",
    en: "Samut Sakhon",
    lat: 13.5475,
    lon: 100.2744,
    region: "ภาคกลาง",
  },
  {
    name: "สิงห์บุรี",
    en: "Sing Buri",
    lat: 14.8937,
    lon: 100.3967,
    region: "ภาคกลาง",
  },
  {
    name: "สุโขทัย",
    en: "Sukhothai",
    lat: 17.0061,
    lon: 99.823,
    region: "ภาคกลาง",
  },
  {
    name: "สุพรรณบุรี",
    en: "Suphan Buri",
    lat: 14.4745,
    lon: 100.1218,
    region: "ภาคกลาง",
  },
  {
    name: "อ่างทอง",
    en: "Ang Thong",
    lat: 14.5896,
    lon: 100.4549,
    region: "ภาคกลาง",
  },
  {
    name: "อุทัยธานี",
    en: "Uthai Thani",
    lat: 15.3794,
    lon: 100.0244,
    region: "ภาคกลาง",
  },
  { name: "ตาก", en: "Tak", lat: 16.884, lon: 99.126, region: "ภาคกลาง" },

  // ภาคตะวันออก (Eastern Thailand)
  {
    name: "จันทบุรี",
    en: "Chanthaburi",
    lat: 12.6107,
    lon: 102.1038,
    region: "ภาคตะวันออก",
  },
  {
    name: "ฉะเชิงเทรา",
    en: "Chachoengsao",
    lat: 13.6904,
    lon: 101.0779,
    region: "ภาคตะวันออก",
  },
  {
    name: "ชลบุรี",
    en: "Chonburi",
    lat: 13.3611,
    lon: 100.9847,
    region: "ภาคตะวันออก",
  },
  {
    name: "ตราด",
    en: "Trat",
    lat: 12.2436,
    lon: 102.515,
    region: "ภาคตะวันออก",
  },
  {
    name: "ปราจีนบุรี",
    en: "Prachin Buri",
    lat: 14.0459,
    lon: 101.3675,
    region: "ภาคตะวันออก",
  },
  {
    name: "ระยอง",
    en: "Rayong",
    lat: 12.6807,
    lon: 101.2538,
    region: "ภาคตะวันออก",
  },
  {
    name: "สระแก้ว",
    en: "Sa Kaeo",
    lat: 13.824,
    lon: 102.0683,
    region: "ภาคตะวันออก",
  },

  // ภาคตะวันตก (Western Thailand)
  {
    name: "กาญจนบุรี",
    en: "Kanchanaburi",
    lat: 14.0227,
    lon: 99.5328,
    region: "ภาคตะวันตก",
  },
  {
    name: "เพชรบุรี",
    en: "Phetchaburi",
    lat: 13.1115,
    lon: 99.9395,
    region: "ภาคตะวันตก",
  },
  {
    name: "ประจวบคีรีขันธ์",
    en: "Prachuap Khiri Khan",
    lat: 11.8127,
    lon: 99.7973,
    region: "ภาคตะวันตก",
  },
  {
    name: "ราชบุรี",
    en: "Ratchaburi",
    lat: 13.5282,
    lon: 99.8133,
    region: "ภาคตะวันตก",
  },

  // ภาคใต้ (Southern Thailand)
  { name: "กระบี่", en: "Krabi", lat: 8.0863, lon: 98.9063, region: "ภาคใต้" },
  { name: "ชุมพร", en: "Chumphon", lat: 10.493, lon: 99.18, region: "ภาคใต้" },
  { name: "ตรัง", en: "Trang", lat: 7.5563, lon: 99.6114, region: "ภาคใต้" },
  {
    name: "นครศรีธรรมราช",
    en: "Nakhon Si Thammarat",
    lat: 8.4304,
    lon: 99.9631,
    region: "ภาคใต้",
  },
  {
    name: "นราธิวาส",
    en: "Narathiwat",
    lat: 6.4254,
    lon: 101.8253,
    region: "ภาคใต้",
  },
  {
    name: "ปัตตานี",
    en: "Pattani",
    lat: 6.8687,
    lon: 101.2502,
    region: "ภาคใต้",
  },
  {
    name: "พังงา",
    en: "Phang Nga",
    lat: 8.4519,
    lon: 98.5198,
    region: "ภาคใต้",
  },
  {
    name: "พัทลุง",
    en: "Phatthalung",
    lat: 7.6167,
    lon: 100.0737,
    region: "ภาคใต้",
  },
  { name: "ภูเก็ต", en: "Phuket", lat: 7.8804, lon: 98.3923, region: "ภาคใต้" },
  { name: "ยะลา", en: "Yala", lat: 6.541, lon: 101.2802, region: "ภาคใต้" },
  { name: "ระนอง", en: "Ranong", lat: 9.9558, lon: 98.6348, region: "ภาคใต้" },
  {
    name: "สงขลา",
    en: "Songkhla",
    lat: 7.2057,
    lon: 100.5951,
    region: "ภาคใต้",
  },
  { name: "สตูล", en: "Satun", lat: 6.6238, lon: 100.0673, region: "ภาคใต้" },
  {
    name: "สุราษฎร์ธานี",
    en: "Surat Thani",
    lat: 9.1382,
    lon: 99.3215,
    region: "ภาคใต้",
  },

  // เมืองท่องเที่ยวพิเศษ
  {
    name: "พัทยา",
    en: "Pattaya",
    lat: 12.9236,
    lon: 100.8825,
    region: "ภาคตะวันออก",
  },
  {
    name: "หัวหิน",
    en: "Hua Hin",
    lat: 12.5706,
    lon: 99.9576,
    region: "ภาคตะวันตก",
  },
  {
    name: "เขาใหญ่",
    en: "Khao Yai",
    lat: 14.4297,
    lon: 101.3717,
    region: "ภาคกลาง",
  },
];

// Get list of Thai provinces
router.get("/provinces", (req, res) => {
  res.json(thaiProvinces);
});

// Get current weather by city name or coordinates
router.get("/current", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let weatherData;

    if (city) {
      // Find city in Thai provinces
      const province = thaiProvinces.find(
        (p) =>
          p.name.includes(city) ||
          p.en.toLowerCase().includes(city.toLowerCase())
      );

      if (province) {
        weatherData = await getWeatherByCoordinates(province.lat, province.lon);
        weatherData.location = province.name;
      } else {
        return res.status(404).json({ error: "ไม่พบข้อมูลจังหวัดที่ค้นหา" });
      }
    } else if (lat && lon) {
      weatherData = await getWeatherByCoordinates(
        parseFloat(lat),
        parseFloat(lon)
      );
    } else {
      // Default to Bangkok
      const bangkok = thaiProvinces[0];
      weatherData = await getWeatherByCoordinates(bangkok.lat, bangkok.lon);
      weatherData.location = bangkok.name;
    }

    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({
      error: "ไม่สามารถดึงข้อมูลสภาพอากาศได้",
      details: error.message,
    });
  }
});

// Get weather forecast
router.get("/forecast", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let coordinates;

    if (city) {
      const province = thaiProvinces.find(
        (p) =>
          p.name.includes(city) ||
          p.en.toLowerCase().includes(city.toLowerCase())
      );

      if (province) {
        coordinates = {
          lat: province.lat,
          lon: province.lon,
          name: province.name,
        };
      } else {
        return res.status(404).json({ error: "ไม่พบข้อมูลจังหวัดที่ค้นหา" });
      }
    } else if (lat && lon) {
      coordinates = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: "ตำแหน่งที่เลือก",
      };
    } else {
      const bangkok = thaiProvinces[0];
      coordinates = { lat: bangkok.lat, lon: bangkok.lon, name: bangkok.name };
    }

    const forecastData = await getForecastByCoordinates(
      coordinates.lat,
      coordinates.lon
    );
    forecastData.location = coordinates.name;

    res.json(forecastData);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    res.status(500).json({
      error: "ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้",
      details: error.message,
    });
  }
});

// Helper function to get weather by coordinates
async function getWeatherByCoordinates(lat, lon) {
  // ใช้ OpenWeatherMap API
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenWeatherMap API key ไม่ได้ถูกตั้งค่า");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather`;
  const params = {
    lat: lat,
    lon: lon,
    appid: apiKey,
    units: "metric",
    lang: "th",
  };

  const response = await axios.get(url, { params });
  const data = response.data;

  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    visibility: data.visibility ? data.visibility / 1000 : null,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    coordinates: { lat, lon },
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: new Date().toISOString(),
  };
}

// Helper function to get forecast by coordinates
async function getForecastByCoordinates(lat, lon) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenWeatherMap API key ไม่ได้ถูกตั้งค่า");
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast`;
  const params = {
    lat: lat,
    lon: lon,
    appid: apiKey,
    units: "metric",
    lang: "th",
  };

  const response = await axios.get(url, { params });
  const data = response.data;

  // Group forecast by days (next 5 days)
  const dailyForecasts = [];
  const processedDates = new Set();

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toDateString();

    if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
      processedDates.add(dateStr);

      dailyForecasts.push({
        date: date.toLocaleDateString("th-TH", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        temperature: {
          min: Math.round(item.main.temp_min),
          max: Math.round(item.main.temp_max),
          avg: Math.round(item.main.temp),
        },
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind.speed,
        timestamp: item.dt,
      });
    }
  });

  return {
    forecasts: dailyForecasts,
    coordinates: { lat, lon },
    timestamp: new Date().toISOString(),
  };
}

module.exports = router;
