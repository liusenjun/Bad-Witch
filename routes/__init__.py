"""
Routes package - API endpoint handlers
"""

from .main_routes import main_bp
from .analysis_routes import analysis_bp
from .familiar_routes import familiar_bp

__all__ = ['main_bp', 'analysis_bp', 'familiar_bp']
