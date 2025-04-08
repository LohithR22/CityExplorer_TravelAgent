import os
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from groq import Groq
from flask_cors import CORS

load_dotenv()

# Groq API key from .env
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

# Function to get city overview and top 5 places using Groq Llama model
def get_city_info(city_name):
    prompt = (
        f"Provide information about {city_name} in the following structured format:\n"
        "1. OVERVIEW: A brief 2-3 sentence overview of the city\n"
        "2. HISTORY: 2-3 sentences about historical significance\n"
        "3. ATTRACTIONS BY CATEGORY:\n"
        "   HISTORICAL PLACES:\n"
        "   - [Place Name] - [Brief description]\n"
        "   - [Place Name] - [Brief description]\n"
        "   NATURE & OUTDOORS:\n"
        "   - [Place Name] - [Brief description]\n"
        "   - [Place Name] - [Brief description]\n"
        "   SPIRITUAL & RELIGIOUS:\n"
        "   - [Place Name] - [Brief description]\n"
        "   - [Place Name] - [Brief description]\n"
        "   UNIQUE EXPERIENCES:\n"
        "   - [Place Name] - [Brief description]\n"
        "   - [Place Name] - [Brief description]\n"
        "   LOCAL CULTURE:\n"
        "   - [Place Name] - [Brief description]\n"
        "   - [Place Name] - [Brief description]\n\n"
        "Keep descriptions concise and factual. List 2-3 places for each category."
    )

    # Request to Groq API for completion
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,  # Reduced for more consistent outputs
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
    )

    return completion.choices[0].message.content.strip()

# Function to get current weather
def get_weather(city_name):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={WEATHER_API_KEY}&units=metric"
    res = requests.get(url).json()
    
    if res.get("cod") != 200:
        return "Weather data not found."

    desc = res["weather"][0]["description"]
    temp = res["main"]["temp"]
    return f"Current weather in {city_name}: {desc}, {temp}°C"

# Function to extract places from the response
def extract_places_from_response(response_text):
    lines = response_text.split('\n')
    categories = {
        'HISTORICAL PLACES': [],
        'NATURE & OUTDOORS': [],
        'SPIRITUAL & RELIGIOUS': [],
        'UNIQUE EXPERIENCES': [],
        'LOCAL CULTURE': []
    }
    
    current_category = None
    
    for line in lines:
        line = line.strip()
        
        # Check if line is a category header
        for category in categories.keys():
            if category in line:
                current_category = category
                break
                
        # If line starts with a dash and we're in a category, it's a place
        if line.startswith('-') and current_category:
            try:
                # Extract place name and description
                place_info = line[1:].strip()
                if '-' in place_info:
                    place_name, description = place_info.split('-', 1)
                else:
                    place_name, description = place_info, ""
                
                place_name = place_name.strip()
                description = description.strip()
                
                if place_name:
                    categories[current_category].append({
                        'name': place_name,
                        'description': description,
                        'category': current_category
                    })
            except Exception as e:
                print(f"Error processing line: {line}, Error: {str(e)}")
                continue
    
    # Flatten the categories into a single list while preserving category information
    all_places = []
    for category, places in categories.items():
        all_places.extend(places)
    
    return all_places

# Route to get sightseeing information
@app.route('/api/sightseeing', methods=['GET'])
def sightseeing_agent():
    city = request.args.get('city', '')
    if not city:
        return jsonify({"error": "City parameter is required."}), 400

    try:
        # Get city information using Groq Llama model
        city_info = get_city_info(city)
        weather_info = get_weather(city)
        places = extract_places_from_response(city_info)

        # Get coordinates for each place
        place_coordinates = []
        for place in places:
            try:
                geocode_url = f"https://nominatim.openstreetmap.org/search?format=json&q={place['name']},{city}"
                headers = {'User-Agent': 'SightseeingApp/1.0'}
                response = requests.get(geocode_url, headers=headers)
                
                if response.status_code == 200:
                    geocode_res = response.json()
                    if geocode_res:
                        place_coordinates.append({
                            "name": place['name'],
                            "description": place['description'],
                            "category": place['category'],
                            "latitude": geocode_res[0]["lat"],
                            "longitude": geocode_res[0]["lon"]
                        })
            except Exception as e:
                print(f"Error geocoding {place['name']}: {str(e)}")
                continue

        return jsonify({
            "city_info": city_info,
            "weather_info": weather_info,
            "places": place_coordinates
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
