class WeatherApp {
  constructor() {
    this.currentLocation = null;
    this.provinces = [];
    this.forecastData = null;
    this.currentChart = null;
    this.activeChartType = "temperature";
    this.init();
  }

  async init() {
    await this.loadProvinces();
    this.setupEventListeners();
    await this.loadDefaultWeather();
    this.setupSensorDataFetching(); // << เพิ่มการเรียกฟังก์ชันสำหรับ Sensor
    this.hideLoading();
    this.updateLastUpdateTime();
  }

  async loadProvinces() {
    try {
      const response = await fetch("/api/weather/provinces");
      this.provinces = await response.json();
      this.populateProvinceSelect();
    } catch (error) {
      console.error("Error loading provinces:", error);
      this.showError("ไม่สามารถโหลดข้อมูลจังหวัดได้");
    }
  }

  populateProvinceSelect() {
    const select = document.getElementById("provinceSelect");
    select.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';

    this.provinces.forEach((province) => {
      const option = document.createElement("option");
      option.value = province.name;
      option.textContent = province.name;
      select.appendChild(option);
    });
  }

  setupEventListeners() {
    const searchBtn = document.getElementById("searchBtn");
    const provinceSelect = document.getElementById("provinceSelect");

    searchBtn.addEventListener("click", () => {
      const selectedProvince = provinceSelect.value;
      if (selectedProvince) {
        this.getWeather(selectedProvince);
      } else {
        this.showError("กรุณาเลือกจังหวัด");
      }
    });

    provinceSelect.addEventListener("change", () => {
      const selectedProvince = provinceSelect.value;
      if (selectedProvince) {
        this.getWeather(selectedProvince);
      }
    });

    // Refresh button
    document.getElementById("refreshBtn").addEventListener("click", () => {
      this.refreshCurrentWeather();
    });

    // Location button
    document.getElementById("locationBtn").addEventListener("click", () => {
      this.getCurrentLocation();
    });

    // Chart tab buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("chart-tab-btn")) {
        const chartType = e.target.dataset.chart;
        this.switchChart(chartType);
      }
    });
  }

  async loadDefaultWeather() {
    // Load Bangkok weather as default
    await this.getWeather("กรุงเทพมหานคร");
  }

  async searchWeather() {
    const selectedProvince = document.getElementById("provinceSelect").value;

    if (!selectedProvince) {
      this.showError("กรุณาเลือกจังหวัด");
      return;
    }

    await this.getWeather(selectedProvince);
  }

  async getWeather(city) {
    try {
      this.showLoading();

      // Get current weather
      const weatherResponse = await fetch(
        `/api/weather/current?city=${encodeURIComponent(city)}`
      );
      if (!weatherResponse.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลสภาพอากาศได้");
      }
      const weatherData = await weatherResponse.json();

      // Get forecast
      const forecastResponse = await fetch(
        `/api/weather/forecast?city=${encodeURIComponent(city)}`
      );
      if (!forecastResponse.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้");
      }
      const forecastData = await forecastResponse.json();

      this.displayCurrentWeather(weatherData);
      this.displayForecast(forecastData);
      this.forecastData = forecastData; // เก็บข้อมูล forecast สำหรับกราฟ
      this.createChart(); // สร้างกราฟ
      this.currentLocation = city;
      this.updateLastUpdateTime();
      this.hideError();
    } catch (error) {
      console.error("Error getting weather:", error);
      this.showError(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      this.hideLoading();
    }
  }

  async getWeatherByCoordinates(lat, lon) {
    try {
      this.showLoading();

      // Get current weather
      const weatherResponse = await fetch(
        `/api/weather/current?lat=${lat}&lon=${lon}`
      );
      if (!weatherResponse.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลสภาพอากาศได้");
      }
      const weatherData = await weatherResponse.json();

      // Get forecast
      const forecastResponse = await fetch(
        `/api/weather/forecast?lat=${lat}&lon=${lon}`
      );
      if (!forecastResponse.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้");
      }
      const forecastData = await forecastResponse.json();

      this.displayCurrentWeather(weatherData);
      this.displayForecast(forecastData);
      this.forecastData = forecastData; // เก็บข้อมูล forecast สำหรับกราฟ
      this.createChart(); // สร้างกราฟ
      this.currentLocation = "ตำแหน่งปัจจุบัน";
      this.updateLastUpdateTime();
      this.hideError();
    } catch (error) {
      console.error("Error getting weather by coordinates:", error);
      this.showError(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      this.hideLoading();
    }
  }

  displayCurrentWeather(data) {
    // Update location
    document.getElementById("currentLocation").textContent =
      data.location || "ไม่ทราบตำแหน่ง";

    // Update time
    document.getElementById("currentTime").textContent =
      new Date().toLocaleString("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    // Update weather icon
    const iconElement = document.getElementById("weatherIcon");
    const iconCode = data.icon;
    iconElement.className = this.getWeatherIconClass(iconCode);

    // Update temperature and description
    document.getElementById(
      "temperature"
    ).textContent = `${data.temperature}°C`;
    document.getElementById("weatherDescription").textContent =
      data.description;

    // Update weather details
    document.getElementById("visibility").textContent = data.visibility
      ? `${data.visibility} กม.`
      : "ไม่ทราบ";
    document.getElementById("humidity").textContent = `${data.humidity}%`;
    document.getElementById("pressure").textContent = `${data.pressure} hPa`;
    document.getElementById(
      "windSpeed"
    ).textContent = `${data.windSpeed} ม./วินาที`;
    document.getElementById("sunrise").textContent = data.sunrise;
    document.getElementById("sunset").textContent = data.sunset;

    // Show current weather section
    document.getElementById("currentWeather").classList.remove("hidden");
  }

  displayForecast(data) {
    const container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    data.forecasts.forEach((forecast) => {
      const forecastCard = document.createElement("div");
      forecastCard.className = "forecast-card";

      forecastCard.innerHTML = `
                <div class="mb-2">
                    <div class="text-white text-sm font-medium mb-1">${
                      forecast.date
                    }</div>
                    <div class="weather-icon mb-2">
                        <i class="${this.getWeatherIconClass(
                          forecast.icon
                        )} text-3xl text-yellow-300"></i>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-white text-lg font-semibold">${
                          forecast.temperature.max
                        }°</span>
                        <span class="text-white text-opacity-70 text-sm">${
                          forecast.temperature.min
                        }°</span>
                    </div>
                    <div class="text-white text-opacity-80 text-xs mb-2">${
                      forecast.description
                    }</div>
                </div>
                
                <div class="space-y-1.5 mt-auto">
                    <div class="bg-white bg-opacity-10 rounded px-2 py-1 flex items-center justify-between">
                        <span class="text-white text-opacity-80 text-xs flex items-center">
                            <i class="fas fa-droplet mr-1 text-blue-300"></i>ความชื้น
                        </span>
                        <span class="text-white text-xs font-medium">${
                          forecast.humidity
                        }%</span>
                    </div>
                    <div class="bg-white bg-opacity-10 rounded px-2 py-1 flex items-center justify-between">
                        <span class="text-white text-opacity-80 text-xs flex items-center">
                            <i class="fas fa-wind mr-1 text-gray-300"></i>ลม
                        </span>
                        <span class="text-white text-xs font-medium">${
                          forecast.windSpeed
                        } m/s</span>
                    </div>
                    <div class="bg-white bg-opacity-10 rounded px-2 py-1 flex items-center justify-between">
                        <span class="text-white text-opacity-80 text-xs flex items-center">
                            <i class="fas fa-thermometer-half mr-1 text-orange-300"></i>เฉลี่ย
                        </span>
                        <span class="text-white text-xs font-medium">${
                          forecast.temperature.avg
                        }°</span>
                    </div>
                </div>
            `;

      container.appendChild(forecastCard);
    });

    // Show forecast section
    document.getElementById("forecastSection").classList.remove("hidden");

    // Show chart section
    document.getElementById("chartSection").classList.remove("hidden");
  }

  getWeatherIconClass(iconCode) {
    const iconMap = {
      "01d": "fas fa-sun", // clear sky day
      "01n": "fas fa-moon", // clear sky night
      "02d": "fas fa-cloud-sun", // few clouds day
      "02n": "fas fa-cloud-moon", // few clouds night
      "03d": "fas fa-cloud", // scattered clouds
      "03n": "fas fa-cloud",
      "04d": "fas fa-cloud", // broken clouds - แก้ไขจาก fas fa-clouds
      "04n": "fas fa-cloud", // broken clouds - แก้ไขจาก fas fa-clouds
      "09d": "fas fa-cloud-rain", // shower rain
      "09n": "fas fa-cloud-rain",
      "10d": "fas fa-cloud-sun-rain", // rain day
      "10n": "fas fa-cloud-moon-rain", // rain night
      "11d": "fas fa-bolt", // thunderstorm
      "11n": "fas fa-bolt",
      "13d": "fas fa-snowflake", // snow
      "13n": "fas fa-snowflake",
      "50d": "fas fa-smog", // mist
      "50n": "fas fa-smog",
    };

    return iconMap[iconCode] || "fas fa-question-circle";
  }

  async getCurrentLocation() {
    if (!navigator.geolocation) {
      this.showError("เบราว์เซอร์ไม่รองรับการหาตำแหน่ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await this.getWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        this.showError("ไม่สามารถหาตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  async refreshCurrentWeather() {
    if (this.currentLocation) {
      await this.getWeather(this.currentLocation);
    } else {
      await this.loadDefaultWeather();
    }
  }

  showLoading() {
    document.getElementById("loading").classList.remove("hidden");
  }

  hideLoading() {
    document.getElementById("loading").classList.add("hidden");
  }

  showError(message) {
    document.getElementById("errorText").textContent = message;
    document.getElementById("errorMessage").classList.remove("hidden");

    // Auto hide error after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError() {
    document.getElementById("errorMessage").classList.add("hidden");
  }

  updateLastUpdateTime() {
    const now = new Date().toLocaleString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    document.getElementById("lastUpdate").textContent = now;
  }

  // ฟังก์ชันสำหรับสร้างกราฟ
  createChart() {
    if (!this.forecastData || !this.forecastData.forecasts) {
      return;
    }

    const ctx = document.getElementById("weatherChart").getContext("2d");

    // ทำลายกราฟเดิมถ้ามี
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    // เตรียมข้อมูลสำหรับกราฟ
    const labels = this.forecastData.forecasts.map((forecast) => {
      const date = new Date();
      const dayIndex = this.forecastData.forecasts.indexOf(forecast);
      date.setDate(date.getDate() + dayIndex + 1);
      return date.toLocaleDateString("th-TH", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    });

    const chartData = this.getChartData();

    this.currentChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: chartData.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartData.title,
            color: "white",
            font: {
              size: 16,
              family: "Sarabun",
            },
          },
          legend: {
            labels: {
              color: "white",
              font: {
                family: "Sarabun",
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white",
              font: {
                family: "Sarabun",
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          y: {
            ticks: {
              color: "white",
              font: {
                family: "Sarabun",
              },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
        },
        elements: {
          point: {
            radius: 8,
            hoverRadius: 12,
            borderWidth: 3,
            backgroundColor: "white",
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
          },
        },
      },
    });
  }

  getChartData() {
    const forecasts = this.forecastData.forecasts;

    switch (this.activeChartType) {
      case "temperature":
        return {
          title: "แนวโน้มอุณหภูมิ (°C)",
          datasets: [
            {
              label: "อุณหภูมิ",
              data: forecasts.map((f) => f.temperature.avg),
              borderColor: "#ff6b35",
              backgroundColor: "rgba(255, 107, 53, 0.2)",
              pointBackgroundColor: "#ff6b35",
              pointBorderColor: "white",
              pointBorderWidth: 3,
              fill: true,
            },
          ],
        };

      case "humidity":
        return {
          title: "แนวโน้มความชื้น (%)",
          datasets: [
            {
              label: "ความชื้น",
              data: forecasts.map((f) => f.humidity),
              borderColor: "#00e5ff",
              backgroundColor: "rgba(0, 229, 255, 0.2)",
              pointBackgroundColor: "#00e5ff",
              pointBorderColor: "white",
              pointBorderWidth: 3,
              fill: true,
            },
          ],
        };

      case "wind":
        return {
          title: "แนวโน้มความเร็วลม (ม./วินาที)",
          datasets: [
            {
              label: "ความเร็วลม",
              data: forecasts.map((f) => f.windSpeed),
              borderColor: "#00ff88",
              backgroundColor: "rgba(0, 255, 136, 0.2)",
              pointBackgroundColor: "#00ff88",
              pointBorderColor: "white",
              pointBorderWidth: 3,
              fill: true,
            },
          ],
        };

      case "pressure":
        return {
          title: "แนวโน้มความกดอากาศ (hPa)",
          datasets: [
            {
              label: "ความกดอากาศ",
              data: forecasts.map((f) => f.pressure || 1013),
              borderColor: "#ff3d71",
              backgroundColor: "rgba(255, 61, 113, 0.2)",
              pointBackgroundColor: "#ff3d71",
              pointBorderColor: "white",
              pointBorderWidth: 3,
              fill: true,
            },
          ],
        };

      default:
        return this.getChartData("temperature");
    }
  }

  switchChart(chartType) {
    // อัปเดตปุ่ม active
    document.querySelectorAll(".chart-tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-chart="${chartType}"]`)
      .classList.add("active");

    // อัปเดตประเภทกราฟและสร้างใหม่
    this.activeChartType = chartType;
    this.createChart();
  }

  // --- ฟังก์ชันสำหรับข้อมูลจาก Sensor ---

  setupSensorDataFetching() {
    this.fetchSensorData(); // ดึงข้อมูลครั้งแรก
    setInterval(() => this.fetchSensorData(), 10000); // ดึงข้อมูลทุก 10 วินาที
  }

  async fetchSensorData() {
    try {
      const response = await fetch('/api/sensor/data');
      const result = await response.json();

      if (result.success && result.data) {
        this.displaySensorData(result.data);
      } else {
        console.log('No sensor data available yet.');
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }

  displaySensorData(data) {
    document.getElementById('sensorTemperature').textContent = `${data.temperature}°C`;
    document.getElementById('sensorHumidity').textContent = `${data.humidity}%`;
    document.getElementById('sensorLastUpdate').textContent = new Date(data.timestamp).toLocaleTimeString('th-TH');

    const sensorSection = document.getElementById('sensorDataSection');
    if (sensorSection.classList.contains('hidden')) {
      sensorSection.classList.remove('hidden');
    }
  }

}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp();
});