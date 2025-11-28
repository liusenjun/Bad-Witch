"""
Analysis Routes - Image analysis and generation endpoints
"""

from flask import Blueprint, request, jsonify
import os
import base64

from services.gemini_service import (
    analyze_object_and_suggest_names,
    generate_familiar_image,
    remove_white_background
)

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api')
API_KEY = os.environ.get('API_KEY', '')


@analysis_bp.route('/analyze', methods=['POST'])
def analyze():
    """Analyze uploaded image and suggest familiar names"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        image_data = file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        result = analyze_object_and_suggest_names(base64_image, API_KEY)
        return jsonify(result)
    
    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({
            'originalItem': 'Mystery Object',
            'species': 'Shadow Creature',
            'suggestedNames': ['Umbra', 'Shade', 'Echo'],
            'description': 'A mysterious creature formed from the void.'
        })


@analysis_bp.route('/generate', methods=['POST'])
@analysis_bp.route('/generate-image', methods=['POST'])
def generate_image():
    """Generate familiar image using AI"""
    try:
        data = request.json
        species = data.get('species', 'creature')
        description = data.get('description', 'A magical familiar')
        
        image_url = generate_familiar_image(species, description, API_KEY)
        return jsonify({'imageUrl': image_url})
    
    except Exception as e:
        print(f"Image generation error: {e}")
        return jsonify({'imageUrl': f'https://picsum.photos/seed/{species}/512/512'})


@analysis_bp.route('/remove-background', methods=['POST'])
def remove_bg():
    """Remove white background from image and return transparent PNG"""
    try:
        data = request.json
        image_url = data.get('imageUrl', '')
        threshold = data.get('threshold', 240)
        tolerance = data.get('tolerance', 30)
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400
        
        result_url = remove_white_background(image_url, threshold, tolerance)
        return jsonify({'imageUrl': result_url})
    
    except Exception as e:
        print(f"Background removal error: {e}")
        return jsonify({'error': str(e)}), 500
