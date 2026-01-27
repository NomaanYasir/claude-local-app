/**
 * Weather API using Open-Meteo (free, no API key required)
 */

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get coordinates for a city
 */
export const geocodeCity = async (city) => {
    try {
        const response = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1`);
        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }

        const result = data.results[0];
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country,
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
};

/**
 * Get weather for coordinates (current + 10-day forecast)
 */
export const getWeather = async (latitude, longitude) => {
    try {
        const params = new URLSearchParams({
            latitude,
            longitude,
            current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min',
            temperature_unit: 'fahrenheit',
            wind_speed_unit: 'mph',
            forecast_days: '10',
            timezone: 'auto',
        });

        const response = await fetch(`${WEATHER_API}?${params}`);
        if (!response.ok) throw new Error('Weather fetch failed');

        const data = await response.json();

        // Parse daily forecast
        const forecast = data.daily.time.map((date, i) => ({
            date,
            dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            high: Math.round(data.daily.temperature_2m_max[i]),
            low: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
        }));

        return {
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            weatherCode: data.current.weather_code,
            windSpeed: Math.round(data.current.wind_speed_10m),
            forecast,
        };
    } catch (error) {
        console.error('Weather error:', error);
        throw error;
    }
};

/**
 * Get weather description from WMO code
 */
export const getWeatherDescription = (code) => {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
    };
    return descriptions[code] || 'Unknown';
};

/**
 * Get weather emoji from WMO code
 */
export const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 55) return '🌧️';
    if (code <= 65) return '🌧️';
    if (code <= 75) return '❄️';
    if (code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '🌤️';
};

/**
 * Fetch weather for a city with caching
 */
export const fetchWeatherForCity = async (city) => {
    // Check cache first
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp, cachedCity } = JSON.parse(cached);
            if (cachedCity.toLowerCase() === city.toLowerCase() &&
                Date.now() - timestamp < CACHE_DURATION) {
                return { ...data, fromCache: true };
            }
        }
    } catch (e) {
        // Ignore cache errors
    }

    // Fetch fresh data
    const location = await geocodeCity(city);
    const weather = await getWeather(location.latitude, location.longitude);

    const result = {
        city: location.name,
        country: location.country,
        temperature: weather.temperature,
        humidity: weather.humidity,
        description: getWeatherDescription(weather.weatherCode),
        emoji: getWeatherEmoji(weather.weatherCode),
        windSpeed: weather.windSpeed,
        forecast: weather.forecast?.map(day => ({
            ...day,
            emoji: getWeatherEmoji(day.weatherCode),
        })) || [],
        fromCache: false,
    };

    // Save to cache
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: result,
            timestamp: Date.now(),
            cachedCity: city,
        }));
    } catch (e) {
        // Ignore cache errors
    }

    return result;
};

/**
 * Get cached weather (for offline use)
 */
export const getCachedWeather = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data } = JSON.parse(cached);
            return { ...data, fromCache: true, isStale: true };
        }
    } catch (e) {
        // Ignore
    }
    return null;
};

export default fetchWeatherForCity;
