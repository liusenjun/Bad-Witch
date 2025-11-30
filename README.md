# 🧙‍♀️ Witchfamiliar Forge

A magical web application where users can transform everyday objects into enchanted animal familiars using AI-powered image analysis and generation.

## ✨ Overview

**Witchfamiliar Forge** is an interactive web application that combines AI technology with fantasy themes. Users upload images of real-world objects, and the application uses Google's Gemini AI to analyze the object and suggest what magical creature it could transform into. The app then generates a unique familiar image and lets users collect, manage, and showcase their magical companions.

## 💡 Project Evolution

The inspiration for this project came from an unexpected place — one of our team members was playing *Hades II*, a game steeped in Greek mythology and featuring powerful witches who cast all kinds of spells. That got us thinking: what if we could create an interactive experience that captures the magic of witchcraft?

As we brainstormed, we stumbled upon a delightful little web game called [DrawAFish.com](https://drawafi.sh/). In this game, everyone draws their own little fish, and all the fish swim together in a shared ocean where people can view, like, or dislike each other's creations. We loved this concept of a shared, playful community space.

Then the idea clicked: **What if we combined AI image generation with the witch theme?** Instead of drawing fish, users could take photos of everyday objects around them — a coffee mug, a plant, a book — and through a witch's magical spell, transform them into enchanted animal familiars. These familiars would then live together in a magical forest, where everyone could see and interact with each other's creations.

And that's how **Witchfamiliar Forge** was born — a place where ordinary objects become extraordinary companions through the power of AI and a little bit of magic. ✨
<img width="2540" height="867" alt="image 50" src="https://github.com/user-attachments/assets/72da53d6-b9dc-4064-b89d-6a76049218b1" />
<img width="2547" height="1366" alt="image 51" src="https://github.com/user-attachments/assets/9f4bcb70-0d8a-4987-bba9-818f61feebeb" />

## 🎮 Features

### Core Functionality
- **📷 Image Upload**: Upload photos of everyday objects (cups, books, plants, etc.)
- **🔮 AI Analysis**: Gemini 2.0 Flash identifies objects and suggests magical animal transformations
- **✨ Name Generation**: AI generates 3 mystical, whimsical names for each familiar
- **🎨 Image Generation**: Creates unique familiar artwork using Gemini 2.0 Flash or Pollinations.ai
- **🎤 Voice Summoning**: Optional microphone feature to "summon" your familiar by speaking its name
<img width="1920" height="912" alt="ef89611e6468f5e5d44cd5c2ec15a1fe" src="https://github.com/user-attachments/assets/1e30b632-582a-45e0-9ebb-8067be2f5840" />
<img width="1920" height="912" alt="aead8536c98e3bdfe0220c683f83600f" src="https://github.com/user-attachments/assets/c526a2e7-7f45-44c8-96bf-d870997053d3" />
<img width="1920" height="912" alt="aebda6656c6552611bfc249fe26cfcb1" src="https://github.com/user-attachments/assets/cd542cd7-ee54-4dd4-92fa-7e4e12688c32" />
<img width="1920" height="912" alt="b93ed2fe5f270a8176c49c6d60b74024" src="https://github.com/user-attachments/assets/5691b8d8-f82b-4525-8124-1f67ca916e9c" />
<img width="1318" height="804" alt="3292fc7d9c1a4357c9737c9497afa00f" src="https://github.com/user-attachments/assets/71df32ee-657a-4ef4-9072-434b6e15316f" />

### Pages & Views
- **🏠 Workshop**: Main creation area where users transform objects into familiars
- **🌲 Forest**: Animated view showing all familiars flying on broomsticks across the screen
- **🏡 My Cabin**: Personal collection management for your familiars
- **🏆 Hall of Legends**: Leaderboard ranking familiars by magic power and likes
<img width="1920" height="912" alt="c407ba0541ed07e402e4a56ee207f723" src="https://github.com/user-attachments/assets/ca94c79d-e7fd-4fd8-b123-6003c4d99dca" />
<img width="1920" height="912" alt="de1f55610ef26fc06c71e101a7ac55f0" src="https://github.com/user-attachments/assets/b1a44663-f97a-49fc-ba8a-1a4670aab07d" />
<img width="1920" height="912" alt="eda49870334e025fd65662c99b9f1ccc" src="https://github.com/user-attachments/assets/b5a7d3c3-1bc8-4b1b-af18-3dacc88f25e1" />

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
| **HUANG Liusen** | GenAI image, code review, PR merging, documentation, Prompt engineering |
| **JIN Xi** | Forest view, Cabin page, Frontend animations, GenAI image, Prompt engineering |
| **YIN Linjie** | Reveal animation, Voice summoning feature, UI interactions, Idea construction |

## 📄 License

This project is created for educational purposes as part of a programming course at PolyU.
