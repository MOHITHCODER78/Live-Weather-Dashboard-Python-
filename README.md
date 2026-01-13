# Live Weather Dashboard

A fully functional, interactive weather dashboard web application built with Flask, Python, and modern web technologies. This application provides real-time weather data visualization and analysis using the OpenWeatherMap API.

## Features

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **Interactive Visualizations**: Beautiful charts showing temperature, humidity, pressure trends, and weather distribution
- **5-Day Forecast**: Detailed weather forecast with hourly predictions
- **Modern UI**: Responsive, beautiful design with smooth animations
- **Mobile Friendly**: Fully responsive design that works on all devices
- **Fast & Efficient**: Optimized API calls and data processing

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Data Processing**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn
- **API**: OpenWeatherMap API
- **Frontend**: HTML5, CSS3, JavaScript
- **Deployment**: Render.com

## Prerequisites

- Python 3.8 or higher
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MOHITHCODER78/Live-Weather-Dashboard.git
   cd Live-Weather-Dashboard
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your OpenWeatherMap API key:
     ```
     OPENWEATHER_API_KEY=your_api_key_here
     ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the dashboard**
   - Open your browser and navigate to `http://localhost:5000`

## Deployment on Render

### Step 1: Prepare Your Repository

1. Make sure all files are committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Deploy on Render

1. **Sign up/Login** to [Render.com](https://render.com)

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Live-Weather-Dashboard` repository

3. **Configure the Service**
   - **Name**: `live-weather-dashboard` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free tier is sufficient

4. **Set Environment Variables**
   - Go to the "Environment" section
   - Add a new environment variable:
     - **Key**: `OPENWEATHER_API_KEY`
     - **Value**: Your OpenWeatherMap API key
   - Click "Save Changes"

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the deployment to complete (usually 2-3 minutes)

6. **Access Your Live Dashboard**
   - Once deployed, you'll get a URL like: `https://live-weather-dashboard.onrender.com`
   - Your dashboard is now live!

### Alternative: Using render.yaml

If you prefer using the `render.yaml` configuration file:

1. The `render.yaml` file is already included in the repository
2. In Render dashboard, select "Apply render.yaml" when creating the service
3. Render will automatically read the configuration

## API Endpoints

- `GET /` - Main dashboard page
- `GET /api/weather?city=<city_name>` - Get current weather for a city
- `GET /api/forecast?city=<city_name>` - Get 5-day forecast for a city
- `GET /api/charts?city=<city_name>` - Generate visualization charts
- `GET /api/history?city=<city_name>` - Get weather history

## Project Structure

```
Live-Weather-Dashboard/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── render.yaml           # Render deployment configuration
├── Procfile              # Process file for deployment
├── .gitignore            # Git ignore file
├── README.md             # This file
├── templates/
│   └── index.html        # Main dashboard HTML template
└── static/
    ├── css/
    │   └── style.css     # Stylesheet
    └── js/
        └── dashboard.js  # JavaScript for interactivity
```

## Features in Detail

### Current Weather Display
- Temperature (actual and feels like)
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure
- Visibility
- Cloud coverage
- Sunrise and sunset times
- Weather icon and description

### Data Visualizations
- **Temperature Forecast Chart**: Line chart showing 5-day temperature trends
- **Humidity Forecast Chart**: Bar chart displaying humidity levels
- **Weather Distribution Chart**: Pie chart showing weather condition distribution
- **Pressure Forecast Chart**: Line chart with area fill for atmospheric pressure

### 5-Day Forecast
- Daily weather predictions
- Temperature highs and lows
- Weather conditions
- Wind and humidity data

## Getting Your OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file or Render environment variables

**Note**: Free tier allows 60 calls per minute, which is sufficient for this application.

## Troubleshooting

### Common Issues

1. **API Key Error**
   - Make sure your `OPENWEATHER_API_KEY` is set correctly
   - Verify the API key is active in your OpenWeatherMap account

2. **City Not Found**
   - Ensure the city name is spelled correctly
   - Try using "City, Country" format (e.g., "London, UK")

3. **Deployment Issues on Render**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `requirements.txt`
   - Verify the start command is correct: `gunicorn app:app`

4. **Charts Not Loading**
   - Check browser console for errors
   - Verify the API is returning forecast data
   - Ensure matplotlib backend is set correctly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Mohit Naidu**
- GitHub: [@MOHITHCODER78](https://github.com/MOHITHCODER78)

## Acknowledgments

- OpenWeatherMap for providing the weather API
- Flask community for the excellent framework
- All open-source contributors

---

Made with Flask and Python
