import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import SearchBox from "./components/SearchBox";
import EarthComponent from "./components/EarthComponent";

const API_URL = process.env.REACT_APP_API_URL; // Define API_URL here

const categoryEmojis = {
  "HISTORICAL PLACES": "🏛️",
  "NATURE & OUTDOORS": "🌲",
  "SPIRITUAL & RELIGIOUS": "⛪",
  "UNIQUE EXPERIENCES": "🎯",
  "LOCAL CULTURE": "🎭",
};

function App() {
  const [city, setCity] = useState("");
  const [cityInfo, setCityInfo] = useState("");
  const [weatherInfo, setWeatherInfo] = useState("");
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(4);

  const handleInputChange = (e) => setCity(e.target.value);

  const App = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/endpoint`
          );
          setData(response.data.message);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, []);
  };
  const fetchCityData = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/sightseeing?city=${city}`
      ); // Use API_URL here
      setCityInfo(response.data.city_info);
      setWeatherInfo(response.data.weather_info);
      setPlaces(response.data.places);

      if (response.data.places.length > 0) {
        const firstPlace = response.data.places[0];
        setMapCenter([
          parseFloat(firstPlace.latitude),
          parseFloat(firstPlace.longitude),
        ]);
        setMapZoom(13);
      }
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchCityData();
  };

  const formatCityInfo = (info) => {
    if (!info) return null;

    const sections = info.split("\n\n");
    return sections.map((section, index) => {
      if (section.toLowerCase().includes("overview:")) {
        return (
          <div key={index} className="info-section overview-section">
            <h3>📍 Overview</h3>
            <p>{section.split(":")[1].trim()}</p>
          </div>
        );
      }
      if (section.toLowerCase().includes("history:")) {
        return (
          <div key={index} className="info-section history-section">
            <h3>📜 History</h3>
            <p>{section.split(":")[1].trim()}</p>
          </div>
        );
      }
      return null;
    });
  };

  const groupPlacesByCategory = (places) => {
    const grouped = {};
    places.forEach((place) => {
      if (!grouped[place.category]) grouped[place.category] = [];
      grouped[place.category].push(place);
    });
    return grouped;
  };

  return (
    <div className="app-wrapper">
      <EarthComponent />
      <SearchBox
        city={city}
        onInputChange={handleInputChange}
        onSearch={fetchCityData}
        onKeyPress={handleKeyPress}
        loading={loading}
      />
      {loading && (
        <div className="loading-spinner" style={{ marginTop: "80px" }}>
          <div className="spinner"></div>
          <p>Discovering amazing places...</p>
        </div>
      )}
      {!loading && cityInfo && (
        <div className="content-container">
          <div className="left-column">
            <div className="info-container">
              <div className="weather-card">
                <h3>🌤️ Weather</h3>
                <p>{weatherInfo}</p>
              </div>
              <div className="city-info">{formatCityInfo(cityInfo)}</div>
            </div>
            <div className="places-container">
              <h2 className="explore-heading">
                <span className="emoji">📍</span>
                Explore Places by Category
              </h2>
              <div className="category-sections-grid">
                {Object.entries(groupPlacesByCategory(places)).map(
                  ([category, categoryPlaces]) => (
                    <div
                      key={category}
                      className="category-section"
                      data-category={category}
                    >
                      <h3>
                        {categoryEmojis[category]} {category}
                      </h3>
                      <div className="places-list">
                        {categoryPlaces.map((place, index) => (
                          <div key={index} className="place-item">
                            <div
                              className="place-name"
                              onClick={() => {
                                setMapCenter([
                                  parseFloat(place.latitude),
                                  parseFloat(place.longitude),
                                ]);
                                setMapZoom(15);
                              }}
                            >
                              <span>{place.name}</span>
                              <span style={{ opacity: 0.7 }}>ℹ️</span>
                            </div>
                            <div className="tooltip-container">
                              <div className="tooltip-overlay"></div>
                              <div className="place-tooltip">
                                <div className="tooltip-content">
                                  <div className="tooltip-description">
                                    {place.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="right-column">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {places.map((place, index) => (
                <Marker
                  key={index}
                  position={[
                    parseFloat(place.latitude),
                    parseFloat(place.longitude),
                  ]}
                  icon={L.divIcon({
                    html: categoryEmojis[place.category],
                    className: "custom-marker",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40],
                  })}
                >
                  <Popup>
                    <strong>{place.name}</strong>
                    <p>{place.description}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
