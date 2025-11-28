"""
Familiar Routes - CRUD operations and interactions for familiars
"""

from flask import Blueprint, request, jsonify
import time
import random

from services.storage_service import (
    get_familiars, save_familiar, update_familiar, delete_familiar,
    get_user_familiars, get_leaderboard, get_forest_familiars
)

familiar_bp = Blueprint('familiar', __name__, url_prefix='/api/familiars')


# ============ Read Operations ============

@familiar_bp.route('', methods=['GET'])
def get_all():
    """Get all familiars"""
    return jsonify(get_familiars())


@familiar_bp.route('/forest', methods=['GET'])
def get_forest():
    """Get familiars for forest view"""
    return jsonify(get_forest_familiars())


@familiar_bp.route('/user', methods=['GET'])
def get_user():
    """Get current user's familiars"""
    return jsonify(get_user_familiars())


@familiar_bp.route('/leaderboard', methods=['GET'])
def get_rankings():
    """Get leaderboard rankings"""
    return jsonify(get_leaderboard())


# ============ Create Operation ============

@familiar_bp.route('', methods=['POST'])
def create():
    """Save a new familiar"""
    try:
        data = request.json
        familiar = {
            'id': str(int(time.time() * 1000)),
            'user_id': 'local_user',
            'original_image': data.get('original_image', ''),
            'generated_image': data.get('generated_image', ''),
            'animal_name': data.get('animal_name', 'Unknown'),
            'animal_species': data.get('animal_species', 'Unknown'),
            'original_item_name': data.get('original_item_name', 'Unknown'),
            'magic_power': 0,
            'created_time': int(time.time() * 1000),
            'likes': 0,
            'dislikes': 0,
            'lane': random.randint(0, 4),
            'speed': 10 + random.random() * 20,
            'is_main': False
        }
        save_familiar(familiar)
        return jsonify({'success': True, 'familiar': familiar})
    
    except Exception as e:
        print(f"Save error: {e}")
        return jsonify({'error': str(e)}), 500


# ============ Update Operations ============

@familiar_bp.route('/<familiar_id>', methods=['PUT'])
def update(familiar_id):
    """Update a familiar"""
    try:
        data = request.json
        update_familiar(familiar_id, data)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@familiar_bp.route('/<familiar_id>/like', methods=['POST'])
def like(familiar_id):
    """Like/dislike a familiar"""
    try:
        data = request.json
        value = data.get('value', 1)
        
        familiars = get_familiars()
        familiar = next((f for f in familiars if f['id'] == familiar_id), None)
        
        if familiar:
            # Update likes or dislikes count
            if value > 0:
                new_likes = familiar.get('likes', 0) + 1
                update_familiar(familiar_id, {'likes': new_likes})
            else:
                new_dislikes = familiar.get('dislikes', 0) + 1
                update_familiar(familiar_id, {'dislikes': new_dislikes})
            
            # Recalculate magic_power = likes - dislikes
            updated_familiars = get_familiars()
            updated_familiar = next((f for f in updated_familiars if f['id'] == familiar_id), None)
            new_magic_power = updated_familiar.get('likes', 0) - updated_familiar.get('dislikes', 0)
            update_familiar(familiar_id, {'magic_power': new_magic_power})
            
            return jsonify({
                'success': True, 
                'likes': updated_familiar.get('likes', 0),
                'dislikes': updated_familiar.get('dislikes', 0),
                'magic_power': new_magic_power
            })
        
        return jsonify({'error': 'Familiar not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@familiar_bp.route('/<familiar_id>/set-main', methods=['POST'])
def set_main(familiar_id):
    """Set a familiar as the main one"""
    try:
        familiars = get_user_familiars()
        for f in familiars:
            if f.get('is_main'):
                update_familiar(f['id'], {'is_main': False})
        
        update_familiar(familiar_id, {'is_main': True})
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ Delete Operation ============

@familiar_bp.route('/<familiar_id>', methods=['DELETE'])
def remove(familiar_id):
    """Delete a familiar"""
    try:
        delete_familiar(familiar_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
