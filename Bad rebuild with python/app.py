"""
Witch's Familiar Workshop - Flask Application
A Python port of the original TypeScript/React project

This is the main entry point that initializes the Flask app
and registers all route blueprints.
"""

from flask import Flask
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import route blueprints
from routes import main_bp, analysis_bp, familiar_bp


def create_app():
    """Application factory function"""
    app = Flask(__name__)
    app.secret_key = os.environ.get('SECRET_KEY', 'witch-workshop-secret-key-2024')
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(familiar_bp)
    
    return app


# Create application instance
app = create_app()


if __name__ == '__main__':
    api_key = os.environ.get('API_KEY', '')
    print("🧙‍♀️ Witch's Familiar Workshop starting...")
    print(f"   API Key: {'✓ Configured' if api_key else '✗ Not configured (mock data)'}")
    app.run(debug=True, port=5000)
