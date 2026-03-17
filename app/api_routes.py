from flask import Blueprint, jsonify, request
from .services.weather_service import WeatherService
from .models import db, SearchHistory
from flask_login import current_user
from datetime import datetime

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/weather')
def get_weather():
    city = request.args.get('city', 'London')
    data = WeatherService.get_current_weather(city)
    
    if "error" in data:
        return jsonify(data), 400
        
    # Store in DB if authenticated
    if current_user.is_authenticated:
        history = SearchHistory(
            user_id=current_user.id,
            city=data['name'],
            temp=data['main']['temp']
        )
        db.session.add(history)
        db.session.commit()
    
    return jsonify(data)

@api_bp.route('/forecast')
def get_forecast():
    city = request.args.get('city', 'London')
    data = WeatherService.get_forecast(city)
    
    if "error" in data:
        return jsonify(data), 400
        
    return jsonify(data)

@api_bp.route('/history')
def get_history():
    if current_user.is_authenticated:
        history = SearchHistory.query.filter_by(user_id=current_user.id).order_by(SearchHistory.timestamp.desc()).limit(10).all()
        return jsonify([{
            'city': h.city,
            'temp': h.temp,
            'time': h.timestamp.strftime('%H:%M')
        } for h in history])
    return jsonify([])

@api_bp.route('/analysis')
def get_analysis():
    city = request.args.get('city', 'London')
    data = WeatherService.get_forecast_summary(city)
    return jsonify(data)

