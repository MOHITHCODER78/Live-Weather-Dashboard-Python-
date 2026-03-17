from flask import Blueprint, render_template
from flask_login import current_user
import os

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def landing():
    return render_template('landing.html')

@main_bp.route('/dashboard')
def index():
    api_key = os.getenv('OPENWEATHER_API_KEY', '')
    return render_template('index.html', api_key=api_key)
