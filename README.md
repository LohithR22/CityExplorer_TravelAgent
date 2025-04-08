# 🌍 CitySight Explorer

CitySight Explorer is a personal project built using React (frontend) and Flask (backend). It allows users to explore any city by fetching an AI-generated overview, current weather, and top sightseeing locations categorized across history, nature, spirituality, and culture.

---

## ✨ Features

- 🌆 AI-generated city overview using Groq's LLaMA model
- 🌤️ Real-time weather using OpenWeatherMap API
- 📍 Categorized sightseeing places with coordinates
- 🗺️ Ready to integrate with interactive maps
- 🔄 CORS-enabled backend for easy React communication

---

## 🛠️ Tech Stack

- **Frontend**: React (host on Netlify)
- **Backend**: Flask (host on Render)
- **AI API**: Groq LLaMA-3
- **Weather API**: OpenWeatherMap
- **Geocoding**: OpenStreetMap (Nominatim)

---

## 🚀 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/citysight-explorer.git
cd citysight-explorer
```

---

### 2. Backend Setup (Flask)

#### a. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

#### b. Install dependencies

```bash
pip install -r requirements.txt
```

#### c. Create a `.env` file

```env
GROQ_API_KEY=your_groq_api_key
WEATHER_API_KEY=your_openweather_api_key
```

#### d. Run Flask server

```bash
python app.py
```

The API runs at: `http://localhost:5000/api/sightseeing?city=<input>`

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Set the API base URL to your backend in `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🌐 Free Hosting Suggestions

| Layer    | Platform | URL Example                          |
| -------- | -------- | ------------------------------------ |
| Frontend | Vercel   | `https://city-explorer.netlify.app`  |
| Backend  | Render   | `https://city-explorer.onrender.com` |

---

## 📌 API Endpoint

```
GET /api/sightseeing?city=CityName
```

**Response:**

```json
{
  "city_info": "...",
  "weather_info": "...",
  "places": [
    {
      "name": "Red Fort",
      "description": "...",
      "category": "HISTORICAL PLACES",
      "latitude": "...",
      "longitude": "..."
    }
  ]
}
```

---

## 🧠 Credits

- AI: [Groq LLaMA-3](https://groq.com)
- Weather: [OpenWeatherMap](https://openweathermap.org)
- Geocoding: [OpenStreetMap](https://nominatim.org)

---

## 📜 License

MIT License — Free to use and modify for personal/non-commercial projects.
