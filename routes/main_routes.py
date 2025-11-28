"""
Main Routes - Home page and general routes
"""

from flask import Blueprint, render_template
import os

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Main page"""
    api_key = os.environ.get('API_KEY', '')
    return render_template('index.html', has_api_key=bool(api_key))
