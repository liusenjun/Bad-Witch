<<<<<<< HEAD
# 🧙‍♀️ Witch's Familiar Workshop

A magical web application where users can transform everyday objects into enchanted animal familiars using AI-powered image analysis and generation.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Overview

**Witch's Familiar Workshop** is an interactive web application that combines AI technology with fantasy themes. Users upload images of real-world objects, and the application uses Google's Gemini AI to analyze the object and suggest what magical creature it could transform into. The app then generates a unique familiar image and lets users collect, manage, and showcase their magical companions.

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
| **Environment** | python-dotenv for configuration |

## 📁 Project Structure

```
witch-familiar-workshop/
├── app.py                      # Flask application entry point
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (API keys)
├── .env.example                # Example environment configuration
│
├── routes/                     # API route handlers (modular)
│   ├── __init__.py             # Blueprint exports
│   ├── main_routes.py          # Home page routes
│   ├── analysis_routes.py      # AI analysis & generation endpoints
│   └── familiar_routes.py      # Familiar CRUD operations
│
├── services/                   # Business logic services
│   ├── __init__.py
│   ├── gemini_service.py       # AI services (Gemini API integration)
│   └── storage_service.py      # JSON file storage operations
│
├── templates/
│   └── index.html              # Main HTML template (Jinja2)
│
├── static/
│   ├── js/
│   │   ├── app.js              # Main entry point
│   │   ├── main.js             # Legacy (backup)
│   │   └── modules/            # Modular JavaScript
│   │       ├── state.js        # Global state management
│   │       ├── api.js          # API communication layer
│   │       ├── navigation.js   # Page navigation
│   │       ├── upload.js       # File upload & analysis
│   │       ├── imageGenerator.js # AI image generation
│   │       ├── summon.js       # Voice summoning
│   │       ├── reveal.js       # Familiar reveal
│   │       ├── forest.js       # Forest view
│   │       ├── cabin.js        # Cabin management
│   │       └── leaderboard.js  # Rankings display
│   └── images/
│       ├── broom.png           # Broomstick asset
│       ├── forest.png          # Forest background
│       └── cottage.png         # Cabin background
│
└── data/
    └── familiars.json          # Auto-generated data storage
```

## 🏗️ Architecture

### Backend (Python/Flask)
The backend follows a **Blueprint-based modular architecture**:

| Module | Purpose |
|--------|---------|
| `routes/main_routes.py` | Home page rendering |
| `routes/analysis_routes.py` | AI image analysis & generation |
| `routes/familiar_routes.py` | CRUD operations for familiars |
| `services/gemini_service.py` | Google Gemini API integration |
| `services/storage_service.py` | JSON file persistence |

### Frontend (JavaScript)
The frontend uses a **module pattern** for organization:

| Module | Purpose |
|--------|---------|
| `state.js` | Centralized state management |
| `api.js` | HTTP request wrapper |
| `navigation.js` | SPA-like page routing |
| `upload.js` | File upload and AI analysis |
| `imageGenerator.js` | Image generation pipeline |
| `summon.js` | Voice input functionality |
| `reveal.js` | Familiar reveal animation |
| `forest.js` | Forest view with animations |
| `cabin.js` | Personal collection management |
| `leaderboard.js` | Rankings table |

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API key (optional, but recommended)

### Installation

#### 1. Clone or Download the Project
```bash
cd "your-project-directory"
```

#### 2. Create Virtual Environment
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

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure API Key
Create a `.env` file in the project root:
```env
API_KEY=your-gemini-api-key-here
```

You can get a free API key from [Google AI Studio](https://aistudio.google.com/).

#### 5. Run the Application
```bash
python app.py
```

#### 6. Open in Browser
Navigate to: **http://127.0.0.1:5000**

## 🔌 API Endpoints

### Main Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main application page |

### Analysis & Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Upload image for AI analysis |
| `POST` | `/api/generate-image` | Generate familiar artwork |
| `POST` | `/api/remove-background` | Remove white background from image |

### Familiar Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/familiars` | Get all familiars |
| `POST` | `/api/familiars` | Create new familiar |
| `PUT` | `/api/familiars/<id>` | Update familiar |
| `DELETE` | `/api/familiars/<id>` | Delete familiar |

### Views & Interactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/familiars/forest` | Get familiars for forest view |
| `GET` | `/api/familiars/user` | Get current user's familiars |
| `GET` | `/api/familiars/leaderboard` | Get leaderboard rankings |
| `POST` | `/api/familiars/<id>/like` | Like or dislike a familiar |
| `POST` | `/api/familiars/<id>/set-main` | Set as main familiar |

## 📊 Data Model

Each familiar object contains:

```json
{
  "id": "unique-uuid",
  "user_id": "user-identifier",
  "animal_name": "Whisperwind",
  "animal_species": "Phoenix Cat",
  "original_item_name": "Coffee Mug",
  "original_image": "data:image/jpeg;base64,...",
  "generated_image": "data:image/png;base64,...",
  "magic_power": 85,
  "likes": 12,
  "dislikes": 2,
  "lane": 2,
  "speed": 15,
  "is_main": false,
  "created_time": "2025-11-28T10:30:00Z"
}
```

## 🎨 Image Generation

The application uses a two-tier image generation system:

1. **Primary**: Google Gemini 2.0 Flash Experimental Image Generation
   - High-quality AI-generated images
   - Requires valid API key with available quota

2. **Fallback**: Pollinations.ai
   - Free, no API key required
   - Automatically used when Gemini quota is exceeded

### Background Removal
The app includes a Pillow-based background removal feature that:
- Removes white/light backgrounds from generated images
- Creates transparent PNG output
- Smooths edges for better visual integration

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Google Gemini API key | Optional* |
| `SECRET_KEY` | Flask session secret | Optional |

*Without an API key, the app uses mock data for analysis and Pollinations.ai for image generation.

### Customization

- **Backgrounds**: Replace images in `static/images/` folder
- **Styling**: Modify Tailwind classes in `templates/index.html`
- **AI Prompts**: Edit prompts in `services/gemini_service.py`

## 🐛 Troubleshooting

### Common Issues

**1. "API quota exceeded" error**
- Wait for quota to reset (usually resets daily)
- The app will automatically fall back to Pollinations.ai

**2. Images not displaying**
- Check browser console for errors
- Verify `familiars.json` has correct field names
- Try deleting `data/familiars.json` to reset data

**3. Server won't start**
- Ensure virtual environment is activated
- Check all dependencies are installed
- Verify port 5000 is not in use

## 📝 Usage Tips

1. **Best Object Photos**: Use clear, well-lit photos with simple backgrounds
2. **Name Selection**: Choose names that resonate with the magical theme
3. **Voice Summon**: Speak clearly when using the microphone feature
4. **Forest View**: Hover over flying familiars to see details

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is created for educational purposes as part of a programming course at PolyU.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful image analysis and generation
- **Pollinations.ai** for free image generation fallback
- **Tailwind CSS** for beautiful styling
- **Font Awesome** for icons

---

Made with ✨ magic and 💻 code
=======
# Bad-Witch
this is a interactive python website
>>>>>>> 1429f6ad0083a0de4a54b96924e6bbbec1ea67a6
