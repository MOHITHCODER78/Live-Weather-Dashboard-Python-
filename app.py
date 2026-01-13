from flask import Flask, render_template, jsonify, request
import requests
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)

# OpenWeatherMap API configuration
API_KEY = os.getenv('OPENWEATHER_API_KEY', '')
BASE_URL = "http://api.openweathermap.org/data/2.5"

# Set style for seaborn
sns.set_style("darkgrid")
try:
    plt.style.use('seaborn-v0_8-darkgrid')
except OSError:
    try:
        plt.style.use('seaborn-darkgrid')
    except OSError:
        plt.style.use('ggplot')

# In-memory storage for weather history (in production, use a database)
weather_history = []

def fetch_weather_data(city_name):
    """Fetch current weather data from OpenWeatherMap API"""
    try:
        if not API_KEY:
            print("Error: OPENWEATHER_API_KEY is not set")
            return None
            
        url = f"{BASE_URL}/weather"
        params = {
            'q': city_name,
            'appid': API_KEY,
            'units': 'metric'
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Check if API returned an error
        if 'cod' in data and data['cod'] != 200:
            error_msg = data.get('message', 'Unknown error')
            print(f"API Error: {error_msg}")
            return None
            
        return data
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error fetching weather data: {e}")
        if e.response is not None:
            try:
                error_data = e.response.json()
                print(f"API Error details: {error_data}")
            except:
                print(f"Response text: {e.response.text}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return None

def fetch_forecast_data(city_name):
    """Fetch 5-day weather forecast from OpenWeatherMap API"""
    try:
        if not API_KEY:
            print("Error: OPENWEATHER_API_KEY is not set")
            return None
            
        url = f"{BASE_URL}/forecast"
        params = {
            'q': city_name,
            'appid': API_KEY,
            'units': 'metric'
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Check if API returned an error
        if 'cod' in data and data['cod'] != '200':
            error_msg = data.get('message', 'Unknown error')
            print(f"API Error: {error_msg}")
            return None
            
        return data
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error fetching forecast data: {e}")
        if e.response is not None:
            try:
                error_data = e.response.json()
                print(f"API Error details: {error_data}")
            except:
                print(f"Response text: {e.response.text}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching forecast data: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return None

def create_temperature_chart(forecast_data):
    """Create temperature trend chart"""
    if not forecast_data or 'list' not in forecast_data:
        return None
    
    df = pd.DataFrame(forecast_data['list'])
    df['datetime'] = pd.to_datetime(df['dt'], unit='s')
    df['temp'] = df['main'].apply(lambda x: x['temp'])
    df['date'] = df['datetime'].dt.date
    df['time'] = df['datetime'].dt.strftime('%H:%M')
    
    plt.figure(figsize=(12, 6))
    plt.plot(df['datetime'], df['temp'], marker='o', linewidth=2, markersize=8)
    plt.title('5-Day Temperature Forecast', fontsize=16, fontweight='bold')
    plt.xlabel('Date & Time', fontsize=12)
    plt.ylabel('Temperature (°C)', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100, bbox_inches='tight')
    img.seek(0)
    plt.close()
    
    return base64.b64encode(img.getvalue()).decode()

def create_humidity_chart(forecast_data):
    """Create humidity trend chart"""
    if not forecast_data or 'list' not in forecast_data:
        return None
    
    df = pd.DataFrame(forecast_data['list'])
    df['datetime'] = pd.to_datetime(df['dt'], unit='s')
    df['humidity'] = df['main'].apply(lambda x: x['humidity'])
    
    plt.figure(figsize=(12, 6))
    plt.bar(df['datetime'], df['humidity'], color='skyblue', alpha=0.7, width=0.03)
    plt.title('5-Day Humidity Forecast', fontsize=16, fontweight='bold')
    plt.xlabel('Date & Time', fontsize=12)
    plt.ylabel('Humidity (%)', fontsize=12)
    plt.grid(True, alpha=0.3, axis='y')
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100, bbox_inches='tight')
    img.seek(0)
    plt.close()
    
    return base64.b64encode(img.getvalue()).decode()

def create_weather_distribution_chart(forecast_data):
    """Create weather condition distribution chart"""
    if not forecast_data or 'list' not in forecast_data:
        return None
    
    df = pd.DataFrame(forecast_data['list'])
    df['weather_main'] = df['weather'].apply(lambda x: x[0]['main'])
    weather_counts = df['weather_main'].value_counts()
    
    plt.figure(figsize=(10, 6))
    colors = sns.color_palette("husl", len(weather_counts))
    plt.pie(weather_counts.values, labels=weather_counts.index, autopct='%1.1f%%',
            startangle=90, colors=colors)
    plt.title('Weather Condition Distribution (5-Day Forecast)', fontsize=16, fontweight='bold')
    plt.axis('equal')
    plt.tight_layout()
    
    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100, bbox_inches='tight')
    img.seek(0)
    plt.close()
    
    return base64.b64encode(img.getvalue()).decode()

def create_pressure_chart(forecast_data):
    """Create atmospheric pressure trend chart"""
    if not forecast_data or 'list' not in forecast_data:
        return None
    
    df = pd.DataFrame(forecast_data['list'])
    df['datetime'] = pd.to_datetime(df['dt'], unit='s')
    df['pressure'] = df['main'].apply(lambda x: x['pressure'])
    
    plt.figure(figsize=(12, 6))
    plt.plot(df['datetime'], df['pressure'], marker='s', linewidth=2, 
             markersize=8, color='green', alpha=0.7)
    plt.fill_between(df['datetime'], df['pressure'], alpha=0.3, color='green')
    plt.title('5-Day Atmospheric Pressure Forecast', fontsize=16, fontweight='bold')
    plt.xlabel('Date & Time', fontsize=12)
    plt.ylabel('Pressure (hPa)', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100, bbox_inches='tight')
    img.seek(0)
    plt.close()
    
    return base64.b64encode(img.getvalue()).decode()

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """API endpoint to fetch current weather"""
    city = request.args.get('city', 'London')
    
    try:
        weather_data = fetch_weather_data(city)
        if not weather_data:
            return jsonify({'error': 'Failed to fetch weather data. Please check your API key and city name.'}), 500
        
        # Store in history
        weather_entry = {
            'city': city,
            'timestamp': datetime.now().isoformat(),
            'temperature': weather_data['main']['temp'],
            'humidity': weather_data['main']['humidity'],
            'pressure': weather_data['main']['pressure'],
            'description': weather_data['weather'][0]['description'],
            'wind_speed': weather_data['wind']['speed'] if 'wind' in weather_data else 0
        }
        weather_history.append(weather_entry)
        
        # Keep only last 100 entries
        if len(weather_history) > 100:
            weather_history.pop(0)
        
        return jsonify({
            'city': weather_data['name'],
            'country': weather_data['sys']['country'],
            'temperature': weather_data['main']['temp'],
            'feels_like': weather_data['main']['feels_like'],
            'humidity': weather_data['main']['humidity'],
            'pressure': weather_data['main']['pressure'],
            'description': weather_data['weather'][0]['description'],
            'icon': weather_data['weather'][0]['icon'],
            'wind_speed': weather_data['wind']['speed'] if 'wind' in weather_data else 0,
            'wind_degree': weather_data['wind'].get('deg', 0),
            'visibility': weather_data.get('visibility', 0) / 1000,  # Convert to km
            'clouds': weather_data['clouds']['all'],
            'sunrise': datetime.fromtimestamp(weather_data['sys']['sunrise']).strftime('%H:%M:%S'),
            'sunset': datetime.fromtimestamp(weather_data['sys']['sunset']).strftime('%H:%M:%S')
        })
    except KeyError as e:
        print(f"KeyError in get_weather: {e}")
        return jsonify({'error': f'Unexpected data format from API: missing key {e}'}), 500
    except Exception as e:
        print(f"Error in get_weather: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    """API endpoint to fetch 5-day forecast"""
    city = request.args.get('city', 'London')
    
    forecast_data = fetch_forecast_data(city)
    if not forecast_data:
        return jsonify({'error': 'Failed to fetch forecast data'}), 500
    
    return jsonify(forecast_data)

@app.route('/api/charts', methods=['GET'])
def get_charts():
    """API endpoint to generate visualization charts"""
    city = request.args.get('city', 'London')
    
    forecast_data = fetch_forecast_data(city)
    if not forecast_data:
        return jsonify({'error': 'Failed to fetch forecast data'}), 500
    
    charts = {
        'temperature': create_temperature_chart(forecast_data),
        'humidity': create_humidity_chart(forecast_data),
        'weather_distribution': create_weather_distribution_chart(forecast_data),
        'pressure': create_pressure_chart(forecast_data)
    }
    
    return jsonify(charts)

@app.route('/api/history', methods=['GET'])
def get_history():
    """API endpoint to get weather history"""
    city = request.args.get('city', None)
    
    if city:
        filtered_history = [entry for entry in weather_history if entry['city'].lower() == city.lower()]
        return jsonify(filtered_history[-20:])  # Return last 20 entries
    else:
        return jsonify(weather_history[-20:])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

