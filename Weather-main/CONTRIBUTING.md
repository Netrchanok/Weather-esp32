# 🤝 Contributing to Thai Weather App

> คู่มือสำหรับนักพัฒนาที่ต้องการมีส่วนร่วมในการพัฒนา Thai Weather App

## 🚀 วิธีการมีส่วนร่วม

### 1. Fork และ Clone Repository

```bash
# Fork repository จาก GitHub แล้ว clone มาที่เครื่องของคุณ
git clone https://github.com/your-username/thai-weather-app.git
cd thai-weather-app
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment

```bash
# สร้างไฟล์ .env จาก template
cp .env.production.example .env

# แก้ไขไฟล์ .env ใส่ API Keys ของคุณ
# OPENWEATHER_API_KEY=your_api_key_here
```

### 4. เริ่มพัฒนา

```bash
# รัน development server
npm run dev

# แอปจะเปิดที่ http://localhost:3000
```

## 📝 Code Style Guidelines

### JavaScript

```javascript
// ใช้ camelCase สำหรับตัวแปรและฟังก์ชัน
const weatherData = await getWeatherData();

// ใช้ async/await แทน .then()
const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`/api/weather?city=${city}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    throw error;
  }
};

// ใช้ const/let แทน var
const API_BASE_URL = 'https://api.openweathermap.org';
let currentLocation = null;
```

### CSS/HTML

```css
/* ใช้ Tailwind classes เป็นหลัก */
.weather-card {
  @apply bg-white rounded-lg shadow-lg p-6;
}

/* ใช้ semantic HTML */
<main role="main">
  <section aria-label="Current Weather">
    <h2 class="text-2xl font-bold">สภาพอากาศปัจจุบัน</h2>
  </section>
</main>
```

## 🐛 Bug Reports

### Template สำหรับ Bug Report

```markdown
**Bug Description:**
อธิบายปัญหาที่พบ

**Steps to Reproduce:**
1. ไปที่หน้า...
2. คลิกที่...
3. เกิดข้อผิดพลาด...

**Expected Behavior:**
พฤติกรรมที่ควรจะเป็น

**Screenshots:**
(ถ้ามี)

**Environment:**
- OS: [เช่น macOS, Windows, Linux]
- Browser: [เช่น Chrome, Firefox, Safari]
- Version: [เช่น v1.0.0]
```

## 💡 Feature Requests

### แนวทางการเสนอฟีเจอร์ใหม่

1. **ตรวจสอบ Issues ที่มีอยู่แล้ว** - อาจมีคนเสนอไว้แล้ว
2. **เขียน Use Case ที่ชัดเจน** - อธิบายว่าใครจะใช้และเพื่ออะไร
3. **เสนอ Implementation** - แนวทางการทำงานคร่าวๆ

### Template สำหรับ Feature Request

```markdown
**Feature Title:**
ชื่อฟีเจอร์ที่เสนอ

**Problem Statement:**
ปัญหาหรือความต้องการที่ฟีเจอร์นี้จะแก้ไข

**Proposed Solution:**
วิธีการแก้ไขที่เสนอ

**Alternative Solutions:**
ทางเลือกอื่นๆ ที่พิจารณาแล้ว

**Additional Context:**
ข้อมูลเพิ่มเติม, mockups, หรือ references
```

## 🔧 Development Process

### Branch Naming Convention

```bash
# Feature branches
feature/weather-alerts
feature/dark-mode
feature/offline-support

# Bug fix branches
bugfix/chart-display-issue
bugfix/mobile-responsive

# Hotfix branches
hotfix/api-key-validation
```

### Commit Message Format

```bash
# Format: type(scope): description
feat(weather): add weather alerts functionality
fix(ui): resolve mobile responsive issues
docs(readme): update installation instructions
style(css): improve weather card styling
test(api): add weather API unit tests
refactor(components): simplify weather display logic
```

### Pull Request Process

1. **สร้าง Branch ใหม่** จาก `main`

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **พัฒนาและ Test**

   ```bash
   # เขียนโค้ด
   # รัน tests (ถ้ามี)
   npm test
   
   # ตรวจสอบ code style
   npm run lint
   ```

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(weather): add new weather feature"
   ```

4. **Push และสร้าง PR**

   ```bash
   git push origin feature/your-feature-name
   # ไปที่ GitHub และสร้าง Pull Request
   ```

### PR Checklist

- [ ] โค้ดผ่านการทดสอบแล้ว
- [ ] ไม่มี console.log ใน production code
- [ ] Documentation ได้รับการอัปเดต
- [ ] API changes มี backward compatibility
- [ ] Mobile responsive ได้รับการทดสอบ
- [ ] Performance impact ได้รับการพิจารณา

## 🧪 Testing Guidelines

### Frontend Testing

```javascript
// ตัวอย่างการทดสอบ UI components
describe('WeatherCard Component', () => {
  test('should display weather data correctly', () => {
    const mockData = {
      temperature: 32,
      description: 'Sunny',
      humidity: 65
    };
    
    const card = new WeatherCard(mockData);
    expect(card.getTemperature()).toBe(32);
  });
});
```

### API Testing

```javascript
// ตัวอย่างการทดสอบ API endpoints
describe('Weather API', () => {
  test('GET /api/weather/current should return weather data', async () => {
    const response = await request(app)
      .get('/api/weather/current?city=Bangkok')
      .expect(200);
    
    expect(response.body).toHaveProperty('temperature');
    expect(response.body).toHaveProperty('description');
  });
});
```

## 📊 Performance Guidelines

### Frontend Performance

```javascript
// ใช้ debouncing สำหรับ search input
const debouncedSearch = debounce((query) => {
  searchWeather(query);
}, 300);

// Lazy loading สำหรับ images
<img loading="lazy" src="weather-icon.png" alt="Weather Icon" />

// ใช้ CSS transforms แทน position changes
.weather-animation {
  transform: translateX(10px);
  transition: transform 0.3s ease;
}
```

### Backend Performance

```javascript
// ใช้ caching สำหรับ API responses
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

app.get('/api/weather', async (req, res) => {
  const cacheKey = `weather-${req.query.city}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }
  
  // Fetch fresh data...
});
```

## 🔒 Security Guidelines

### Input Validation

```javascript
// Validate user inputs
const validateCityName = (city) => {
  if (!city || typeof city !== 'string') {
    throw new Error('Invalid city name');
  }
  
  if (city.length > 100) {
    throw new Error('City name too long');
  }
  
  // Remove any potential XSS attempts
  return city.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### Environment Variables

```javascript
// ไม่เปิดเผย sensitive data
const config = {
  apiKey: process.env.OPENWEATHER_API_KEY,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development'
};

// ไม่ส่ง API keys ไปยัง frontend
app.get('/api/config', (req, res) => {
  res.json({
    version: package.version,
    environment: config.nodeEnv
    // ไม่ส่ง apiKey
  });
});
```

## 📚 Resources

### Learning Materials

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JavaScript Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

### Tools

- **Code Editor**: VS Code with extensions
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
- **API Testing**: Postman หรือ Insomnia
- **Browser DevTools**: Chrome DevTools

## 🤝 Community

### Communication Channels

- **GitHub Issues**: สำหรับ bug reports และ feature requests
- **GitHub Discussions**: สำหรับคำถามและการสนทนา
- **Code Reviews**: ใน Pull Requests

### Code of Conduct

1. **เคารพซึ่งกันและกัน** - ทุกคนมีประสบการณ์ที่แตกต่างกัน
2. **ให้ feedback ที่สร้างสรรค์** - ช่วยกันปรับปรุง
3. **เปิดใจรับฟังความคิดเห็น** - ทุกความคิดเห็นมีค่า
4. **ช่วยเหลือผู้เริ่มต้น** - เราทุกคนเคยเป็นมือใหม่

## 🎯 Roadmap

### Phase 1: Core Features ✅

- [x] Basic weather display
- [x] Province selection
- [x] Weather charts
- [x] Responsive design

### Phase 2: Enhanced Features 🚧

- [ ] Weather alerts
- [ ] Historical data
- [ ] Dark mode
- [ ] PWA support

### Phase 3: Advanced Features 📋

- [ ] Weather maps
- [ ] Social sharing
- [ ] Multi-language support
- [ ] Voice commands

## 💝 Recognition

### Contributors

ขอขอบคุณทุกคนที่มีส่วนร่วมในการพัฒนา Thai Weather App:

- **Core Team**: Perapat & Phirawit
- **Contributors**: [ดูรายชื่อทั้งหมด](https://github.com/Ohmies/Thai-Weather-App/contributors)
- **Community**: ทุกคนที่ให้ feedback และแนะนำ

### How to Get Recognition

1. **Contribute Code**: Pull requests ที่ได้รับการ merge
2. **Report Bugs**: Bug reports ที่มีคุณภาพ
3. **Improve Documentation**: การปรับปรุง docs
4. **Help Others**: ตอบคำถามในการ discussions
5. **Spread the Word**: แชร์โปรเจ็กต์ให้คนอื่นรู้จัก

---

<div align="center">

**ขอบคุณที่ร่วมพัฒนา Thai Weather App! 🙏**

*มาร่วมกันสร้าง weather app ที่ดีที่สุดสำหรับคนไทย* 🇹🇭

[📖 Development Guide](./DEVELOPMENT_GUIDE.md) | [🚀 Deployment Guide](./DEPLOYMENT.md) | [📋 README](./README.md)

</div>
