// Default city
let currentCity = 'London';

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load default city weather
    searchWeather('London');
    
    // Add enter key support for search
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});

async function searchWeather(city = null) {
    const cityInput = document.getElementById('cityInput');
    const cityName = city || cityInput.value.trim();
    
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }
    
    currentCity = cityName;
    const errorMessage = document.getElementById('errorMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const weatherContent = document.getElementById('weatherContent');
    
    // Hide error and show loading
    errorMessage.classList.remove('show');
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
    
    try {
        // Fetch current weather
        const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
        const weatherData = await weatherResponse.json();
        
        if (!weatherResponse.ok) {
            throw new Error(weatherData.error || 'Failed to fetch weather data');
        }
        
        // Display current weather
        displayCurrentWeather(weatherData);
        
        // Fetch and display charts
        await loadCharts(cityName);
        
        // Fetch and display forecast
        await loadForecast(cityName);
        
        // Show content and hide loading
        loadingSpinner.style.display = 'none';
        weatherContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        loadingSpinner.style.display = 'none';
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    }
}

function displayCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.city;
    document.getElementById('countryName').textContent = data.country;
    document.getElementById('temperature').textContent = Math.round(data.temperature);
    document.getElementById('feelsLike').textContent = Math.round(data.feels_like);
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('windSpeed').textContent = data.wind_speed.toFixed(1) + ' m/s';
    document.getElementById('pressure').textContent = data.pressure + ' hPa';
    document.getElementById('visibility').textContent = data.visibility.toFixed(1) + ' km';
    document.getElementById('clouds').textContent = data.clouds + '%';
    document.getElementById('sunrise').textContent = data.sunrise;
    document.getElementById('sunset').textContent = data.sunset;
    document.getElementById('weatherDescription').textContent = data.description;
    
    // Set weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('weatherIcon').alt = data.description;
}

async function loadCharts(cityName) {
    try {
        const response = await fetch(`/api/charts?city=${encodeURIComponent(cityName)}`);
        const charts = await response.json();
        
        if (response.ok && charts.temperature) {
            // Display temperature chart
            const tempChart = document.getElementById('tempChart');
            tempChart.src = 'data:image/png;base64,' + charts.temperature;
            tempChart.style.display = 'block';
            
            // Display humidity chart
            const humidityChart = document.getElementById('humidityChart');
            humidityChart.src = 'data:image/png;base64,' + charts.humidity;
            humidityChart.style.display = 'block';
            
            // Display distribution chart
            const distributionChart = document.getElementById('distributionChart');
            distributionChart.src = 'data:image/png;base64,' + charts.weather_distribution;
            distributionChart.style.display = 'block';
            
            // Display pressure chart
            const pressureChart = document.getElementById('pressureChart');
            pressureChart.src = 'data:image/png;base64,' + charts.pressure;
            pressureChart.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading charts:', error);
    }
}

async function loadForecast(cityName) {
    try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(cityName)}`);
        const forecastData = await response.json();
        
        if (response.ok && forecastData.list) {
            displayForecast(forecastData.list);
        }
    } catch (error) {
        console.error('Error loading forecast:', error);
    }
}

function displayForecast(forecastList) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
    
    // Group forecast by date and show one entry per day (or every 8 entries = ~24 hours)
    const dailyForecasts = [];
    const seenDates = new Set();
    
    forecastList.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Show forecast every 8 entries (approximately every 24 hours)
        if (index % 8 === 0 || !seenDates.has(dateStr)) {
            seenDates.add(dateStr);
            dailyForecasts.push({
                date: dateStr,
                time: timeStr,
                temp: item.main.temp,
                feels_like: item.main.feels_like,
                humidity: item.main.humidity,
                pressure: item.main.pressure,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                wind_speed: item.wind?.speed || 0
            });
        }
    });
    
    // Limit to 5 days
    dailyForecasts.slice(0, 5).forEach(forecast => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        forecastItem.innerHTML = `
            <div class="forecast-date">${forecast.date}</div>
            <div class="forecast-time">${forecast.time}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" 
                 alt="${forecast.description}" class="forecast-icon">
            <div class="forecast-temp">${Math.round(forecast.temp)}°C</div>
            <div class="forecast-desc">${forecast.description}</div>
            <div class="forecast-details">
                <div class="forecast-detail-item">
                    <i class="fas fa-tint"></i>
                    <p>${forecast.humidity}%</p>
                </div>
                <div class="forecast-detail-item">
                    <i class="fas fa-wind"></i>
                    <p>${forecast.wind_speed.toFixed(1)} m/s</p>
                </div>
            </div>
        `;
        
        container.appendChild(forecastItem);
    });
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

