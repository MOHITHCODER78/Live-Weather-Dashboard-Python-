# Live Weather Dashboard 🌍
Professional Geospatial Intelligence & Weather Analytics

An immersive, full-screen weather dashboard inspired by high-end geospatial intelligence tools. This application provides real-time global weather telemetry, AI-driven briefings, and predictive data analysis through a modern, glassmorphic interface.

---

##  Key Highlights

### Geospatial Command Center
* **Interactive Global Map**: Full-screen GIS interface built with Leaflet.js, featuring real-time coordinate tracking and zoom telemetry.
* **Premium Map Layers**: Toggle between high-contrast Dark Mode (optimized for night monitoring) and detailed Satellite imagery.
* **Live Radar Overlays**: Visual tracking of precipitation, wind speed, and temperature distributions globally.

### Intelligence & Analytics
* **AI Weather Briefing**: Automated weather pattern analysis and mission-style summaries for any location.
* **Telemetry Feed**: Real-time monitoring of humidity, wind conditions, and atmospheric pressure with Gauge-style indicators.
* **Predictive Trends**: 24-hour temperature projection charts and a scrollable 5-day outlook for strategic planning.

### Enterprise Features
* **Authentication System**: Secure user login and registration to save individualized home locations and search history.
* **PostgreSQL Integration**: Production-ready database structure configured for high-availability cloud deployment on Render.
* **Mission Reports**: One-click PDF export functionality for current weather intelligence data.

---

##  Technical Stack

### Core Technologies
*   **Backend**: Flask (Python) with Flask-Login & SQLAlchemy
*   **Database**: PostgreSQL (Production) / SQLite (Local Development)
*   **Mapping**: Leaflet.js with CartoDB & OpenStreetMap
*   **Visualization**: ApexCharts.js for performance-optimized data graphing

### Modern Design System
*   **Style**: Pure Vanilla CSS with Glassmorphism (Backdrop Blurs)
*   **Aesthetic**: "Zoom Earth" inspired floating panel architecture
*   **Icons**: Font Awesome Pro library integration
*   **Typography**: Google Inter and JetBrains Mono for a high-tech feel

---

##  Local Setup

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/MOHITHCODER78/Live-Weather-Dashboard-Python-.git
   cd Live-Weather-Dashboard-Python-
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   OPENWEATHER_API_KEY=your_key_here
   SECRET_KEY=your_random_string
   ```

3. **Install & Launch**
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
   *Access the terminal at `http://127.0.0.1:5000`*

---

##  Production Deployment

This project is optimized for deployment on **Render.com** using the provided `render.yaml` blueprint.

1. Connect your GitHub repository to Render.
2. Select the **Blueprint** option.
3. Render will automatically provision:
    - A managed **PostgreSQL** database.
    - A **Python Web Service** running Gunicorn.
    - Automatic SSL and environment linking.

---

##  Contributing
Contributions that push the boundaries of weather intelligence are welcome. Please fork the repo and submit a Pull Request.

**Author**: [Mohith Naidu](https://github.com/MOHITHCODER78)  
**License**: MIT
