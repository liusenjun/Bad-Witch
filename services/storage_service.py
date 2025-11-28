"""
Storage Service - Local JSON file storage for familiars

数据模型 Animal:
- id: 唯一标识
- user_id: 用户标识
- original_image: 原物品图片
- generated_image: 生成的动物图片
- animal_name: 魔法名字
- animal_species: 动物种类
- original_item_name: 原物品名称
- magic_power: 魔法值（点赞-点踩）
- created_time: 创建时间
- likes: 点赞数
- dislikes: 点踩数
- lane: 飞行航道 (0-4)
- speed: 飞行速度
- is_main: 是否为主魔宠
"""

import os
import json
import random

STORAGE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'familiars.json')
CURRENT_USER_ID = 'local_user'

# Mock data with new data model
MOCK_FAMILIARS = [
    {
        'id': 'm1',
        'user_id': 'ai_1',
        'original_image': 'https://picsum.photos/seed/watch1/300/300',
        'generated_image': 'https://picsum.photos/seed/owl1/300/300',
        'animal_name': 'Nebula',
        'animal_species': 'Owl',
        'original_item_name': 'Old Watch',
        'magic_power': 120,
        'created_time': 1700000000000,
        'likes': 150,
        'dislikes': 30,
        'lane': 0,
        'speed': 15,
        'is_main': False
    },
    {
        'id': 'm2',
        'user_id': 'ai_2',
        'original_image': 'https://picsum.photos/seed/charcoal2/300/300',
        'generated_image': 'https://picsum.photos/seed/fox2/300/300',
        'animal_name': 'Cinder',
        'animal_species': 'Fox',
        'original_item_name': 'Charcoal',
        'magic_power': 85,
        'created_time': 1700000100000,
        'likes': 100,
        'dislikes': 15,
        'lane': 1,
        'speed': 12,
        'is_main': False
    },
    {
        'id': 'm3',
        'user_id': 'ai_3',
        'original_image': 'https://picsum.photos/seed/feather3/300/300',
        'generated_image': 'https://picsum.photos/seed/raven3/300/300',
        'animal_name': 'Whisper',
        'animal_species': 'Raven',
        'original_item_name': 'Feather',
        'magic_power': 200,
        'created_time': 1700000200000,
        'likes': 250,
        'dislikes': 50,
        'lane': 2,
        'speed': 18,
        'is_main': False
    },
    {
        'id': 'm4',
        'user_id': 'ai_4',
        'original_image': 'https://picsum.photos/seed/crystal4/300/300',
        'generated_image': 'https://picsum.photos/seed/cat4/300/300',
        'animal_name': 'Glimmer',
        'animal_species': 'Cat',
        'original_item_name': 'Crystal',
        'magic_power': 150,
        'created_time': 1700000300000,
        'likes': 180,
        'dislikes': 30,
        'lane': 3,
        'speed': 20,
        'is_main': False
    },
    {
        'id': 'm5',
        'user_id': 'ai_5',
        'original_image': 'https://picsum.photos/seed/rock5/300/300',
        'generated_image': 'https://picsum.photos/seed/toad5/300/300',
        'animal_name': 'Moss',
        'animal_species': 'Toad',
        'original_item_name': 'Rock',
        'magic_power': 45,
        'created_time': 1700000400000,
        'likes': 60,
        'dislikes': 15,
        'lane': 4,
        'speed': 10,
        'is_main': False
    },
]


def _ensure_storage_dir():
    data_dir = os.path.dirname(STORAGE_FILE)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)


def get_familiars() -> list:
    _ensure_storage_dir()
    if not os.path.exists(STORAGE_FILE):
        with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
            json.dump(MOCK_FAMILIARS, f, indent=2)
        return MOCK_FAMILIARS.copy()
    try:
        with open(STORAGE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return MOCK_FAMILIARS.copy()


def _save_familiars(familiars: list):
    _ensure_storage_dir()
    with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
        json.dump(familiars, f, indent=2)


def save_familiar(familiar: dict):
    familiars = get_familiars()
    familiars.insert(0, familiar)
    _save_familiars(familiars)


def update_familiar(familiar_id: str, updates: dict):
    familiars = get_familiars()
    for i, f in enumerate(familiars):
        if f['id'] == familiar_id:
            familiars[i] = {**f, **updates}
            break
    _save_familiars(familiars)


def delete_familiar(familiar_id: str):
    familiars = get_familiars()
    familiars = [f for f in familiars if f['id'] != familiar_id]
    _save_familiars(familiars)


def get_user_familiars() -> list:
    return [f for f in get_familiars() if f.get('user_id') == CURRENT_USER_ID]


def get_leaderboard() -> list:
    return sorted(get_familiars(), key=lambda x: x.get('magic_power', 0), reverse=True)


def get_forest_familiars() -> list:
    familiars = get_familiars()
    for i, f in enumerate(familiars):
        if 'lane' not in f:
            f['lane'] = i % 5
        if 'speed' not in f:
            f['speed'] = 10 + random.random() * 15
    return familiars
