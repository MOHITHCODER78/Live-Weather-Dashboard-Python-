import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('OPENWEATHER_API_KEY', '')
BASE_URL = "http://api.openweathermap.org/data/2.5"

class WeatherService:
    @staticmethod
    def get_current_weather(city_name):
        """Fetch current weather data from OpenWeatherMap API"""
        try:
            if not API_KEY:
                return {"error": "API Key not configured"}
            
            url = f"{BASE_URL}/weather"
            params = {
                'q': city_name,
                'appid': API_KEY,
                'units': 'metric'
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    @staticmethod
    def get_forecast(city_name):
        """Fetch 5-day weather forecast from OpenWeatherMap API"""
        try:
            if not API_KEY:
                return {"error": "API Key not configured"}
            
            url = f"{BASE_URL}/forecast"
            params = {
                'q': city_name,
                'appid': API_KEY,
                'units': 'metric'
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    @staticmethod
    def get_alerts(lat, lon):
        """Fetch weather alerts for coordinates"""
        # Note: One Call API 3.0 is usually required for alerts, 
        # but we can simulate/placeholder this for now or use other sources
        try:
            url = f"{BASE_URL}/onecall"
            params = {
                'lat': lat,
                'lon': lon,
                'exclude': 'current,minutely,hourly,daily',
                'appid': API_KEY
            }
            # This might fail if using basic API key, but good to have prepared
            response = requests.get(url, params=params, timeout=5)
            if response.status_code == 200:
                return response.json().get('alerts', [])
            return []
        except Exception:
            return []
    @staticmethod
    def get_forecast_summary(city_name):
        """Perform data analysis on forecast data"""
        data = WeatherService.get_forecast(city_name)
        if "error" in data or data.get("cod") != "200":
            return {"error": "Could not generate analysis"}
            
        temps = [item['main']['temp'] for item in data['list']]
        humidities = [item['main']['humidity'] for item in data['list']]
        
        return {
            "avg_temp": round(sum(temps) / len(temps), 1),
            "max_temp": round(max(temps), 1),
            "min_temp": round(min(temps), 1),
            "avg_humidity": round(sum(humidities) / len(humidities), 1),
            "data_points": len(temps)
        }
