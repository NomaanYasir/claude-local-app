import React, { useState, useEffect } from 'react';
import { fetchWeatherForCity, getCachedWeather } from '../utils/weatherApi';
import './WeatherCard.css';

const WeatherCard = ({ city, isOffline }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForecast, setShowForecast] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);

            if (isOffline) {
                const cached = getCachedWeather();
                if (cached) {
                    setWeather(cached);
                } else {
                    setError('Weather data unavailable offline');
                }
                setLoading(false);
                return;
            }

            try {
                const data = await fetchWeatherForCity(city);
                setWeather(data);
            } catch (err) {
                const cached = getCachedWeather();
                if (cached) {
                    setWeather(cached);
                    setError('Using cached data');
                } else {
                    setError('Could not fetch weather data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city, isOffline]);

    if (loading) {
        return (
            <div className="weather-card loading">
                <div className="weather-loading">Loading weather for {city}...</div>
            </div>
        );
    }

    if (error && !weather) {
        return (
            <div className="weather-card error">
                <p>⚠️ {error}</p>
            </div>
        );
    }

    return (
        <div className="weather-card">
            <div className="weather-header">
                <span className="weather-emoji">{weather.emoji}</span>
                <div className="weather-location">
                    <h3>{weather.city}</h3>
                    <span>{weather.country}</span>
                </div>
            </div>
            <div className="weather-temp">
                <span className="temp-value">{weather.temperature}°F</span>
                <span className="weather-desc">{weather.description}</span>
            </div>
            <div className="weather-details">
                <span>💧 Humidity: {weather.humidity}%</span>
                <span>💨 Wind: {weather.windSpeed} mph</span>
            </div>

            {/* 10-Day Forecast Toggle */}
            {weather.forecast && weather.forecast.length > 0 && (
                <div className="forecast-section">
                    <button
                        className="forecast-toggle"
                        onClick={() => setShowForecast(!showForecast)}
                        aria-expanded={showForecast}
                        aria-label={showForecast ? 'Hide 10-day forecast' : 'Show 10-day forecast'}
                    >
                        {showForecast ? '▼ Hide 10-Day Forecast' : '▶ Show 10-Day Forecast'}
                    </button>

                    {showForecast && (
                        <div className="forecast-grid">
                            {weather.forecast.map((day, index) => (
                                <div key={day.date} className="forecast-day">
                                    <span className="forecast-day-name">
                                        {index === 0 ? 'Today' : day.dayName}
                                    </span>
                                    <span className="forecast-emoji">{day.emoji}</span>
                                    <span className="forecast-temps">
                                        <span className="forecast-high">{day.high}°</span>
                                        <span className="forecast-low">{day.low}°</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(weather.fromCache || error) && (
                <p className="weather-cache-note">
                    {weather.isStale ? '⚠️ Cached data (may be outdated)' : '📦 From cache'}
                </p>
            )}
        </div>
    );
};

export default WeatherCard;
