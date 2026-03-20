# Live Weather Dashboard
Geospatial Intelligence and Weather Analytics System

The Live Weather Dashboard is an immersive, full-screen application designed for real-time global weather monitoring. Inspired by high-end geospatial tools, it provides a modern interface for tracking weather patterns, analyzing trends, and generating automated reports.

## Core Features

### Geospatial Interface
Interactive global map system built on Leaflet.js with support for multiple layers.
High-contrast dark mode optimized for detailed monitoring.
Direct telemetry for atmospheric pressure, humidity, and wind velocity.

### Intelligent Analysis
Automated weather pattern summaries for any searchable location.
24-hour predictive temperature charts powered by ApexCharts.
Detailed 5-day weather forecasts with humidity and temperature range data.

### Functional Capabilities
Secure user authentication system to manage personalized search histories.
Production-ready PostgreSQL integration for reliable data management.
Mission report generation with single-click PDF export functionality.
Full mobile responsiveness for multi-device compatibility.

## Technical Architecture

### Technologies
Backend: Python with Flask and SQLAlchemy.
Frontend: Vanilla CSS with modern flexbox and grid layouts.
Data Visualization: ApexCharts and Leaflet.js mapping library.
Database: PostgreSQL for production and SQLite for development.

### Interface Design
Standardized glassmorphic design system for a premium aesthetic.
Custom typography using Inter and JetBrains Mono fonts.
Optimized for high-resolution displays and mobile devices.

## Installation and Setup

### Prerequisites
Python 3.8 or higher installed on your system.
A valid OpenWeatherMap API key.

### Configuration
1. Clone the repository to your local machine.
2. Initialize a virtual environment and Install dependencies:
   pip install -r requirements.txt
3. Create a .env file and configure the following variables:
   OPENWEATHER_API_KEY=your_api_key
   SECRET_KEY=your_secure_string

### Running Locally
Execute the following command to start the application:
   python wsgi.py

Access the dashboard at http://localhost:5000 in your web browser.

## Deployment to Render

This application is optimized for deployment on Render.com.

1. Connect your repository to a new Web Service on Render.
2. The platform will automatically detect the render.yaml blueprint and provision the necessary resources.
3. Configure the OPENWEATHER_API_KEY as an environment variable in the Render dashboard.

## Attribution
Author: Mohith Naidu
License: MIT
