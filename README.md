# 🧙‍♀️ Witch's Familiar Workshop

A magical web application where users can transform everyday objects into enchanted animal familiars using AI-powered image analysis and generation.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Overview

**Witch's Familiar Workshop** is an interactive web application that combines AI technology with fantasy themes. Users upload images of real-world objects, and the application uses Google's Gemini AI to analyze the object and suggest what magical creature it could transform into. The app then generates a unique familiar image and lets users collect, manage, and showcase their magical companions.

## 💡 Project Evolution

The inspiration for this project came from an unexpected place — one of our team members was playing *Hades II*, a game steeped in Greek mythology and featuring powerful witches who cast all kinds of spells. That got us thinking: what if we could create an interactive experience that captures the magic of witchcraft?

As we brainstormed, we stumbled upon a delightful little web game called [DrawAFish.com](https://drawafi.sh/). In this game, everyone draws their own little fish, and all the fish swim together in a shared ocean where people can view, like, or dislike each other's creations. We loved this concept of a shared, playful community space.

Then the idea clicked: **What if we combined AI image generation with the witch theme?** Instead of drawing fish, users could take photos of everyday objects around them — a coffee mug, a plant, a book — and through a witch's magical spell, transform them into enchanted animal familiars. These familiars would then live together in a magical forest, where everyone could see and interact with each other's creations.

And that's how **Witch's Familiar Workshop** was born — a place where ordinary objects become extraordinary companions through the power of AI and a little bit of magic. ✨

## 🎮 Features

### Core Functionality
- **📷 Image Upload**: Upload photos of everyday objects (cups, books, plants, etc.)
- **🔮 AI Analysis**: Gemini 2.0 Flash identifies objects and suggests magical animal transformations
- **✨ Name Generation**: AI generates 3 mystical, whimsical names for each familiar
- **🎨 Image Generation**: Creates unique familiar artwork using Gemini 2.0 Flash or Pollinations.ai
- **🎤 Voice Summoning**: Optional microphone feature to "summon" your familiar by speaking its name

### Pages & Views
- **🏠 Workshop**: Main creation area where users transform objects into familiars
- **🌲 Forest**: Animated view showing all familiars flying on broomsticks across the screen
- **🏡 My Cabin**: Personal collection management for your familiars
- **🏆 Hall of Legends**: Leaderboard ranking familiars by magic power and likes

### Social Features
- **👍👎 Like/Dislike System**: Rate other users' familiars
- **⭐ Magic Power**: Each familiar has a magic power rating
- **🎯 Main Familiar**: Set one familiar as your primary companion

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python 3.8+, Flask 2.0+ |
| **AI Analysis** | Google Gemini 2.0 Flash API |
| **Image Generation** | Gemini 2.0 Flash (primary) / Pollinations.ai (fallback) |
| **Image Processing** | Pillow (PIL) for background removal |
| **Frontend** | HTML5, Tailwind CSS, Vanilla JavaScript |
| **Data Storage** | JSON file-based storage |

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API key (optional, but recommended)

### Installation

1. **Clone or Download the Project**
```bash
cd "your-project-directory"
```

2. **Create Virtual Environment**
```powershell
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

```bash
# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure API Key**

Create a `.env` file in the project root:
```env
API_KEY=your-gemini-api-key-here
```

You can get a free API key from [Google AI Studio](https://aistudio.google.com/).

5. **Run the Application**
```bash
python app.py
```

6. **Open in Browser**

Navigate to: **http://127.0.0.1:5000**

## 👥 Team Division

| Member | Responsibilities |
|--------|------------------|
| **HUANG Liusen** | Project management, code review, PR merging, documentation |
| **tlswa-123** | Forest view, Cabin page, frontend animations |
| **Linjie Yin** | Reveal animation, Voice summoning feature, UI interactions |

## 📄 License

This project is created for educational purposes as part of a programming course at PolyU.
