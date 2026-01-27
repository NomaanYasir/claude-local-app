/**
 * Parse query to determine what type of special card to show
 */

// Check if query is asking for weather
export const isWeatherQuery = (query) => {
    const q = query.toLowerCase().trim();
    return q.includes('weather') || q.startsWith('weather in') || q.endsWith('weather');
};

// Extract city from weather query
export const extractCity = (query) => {
    const q = query.toLowerCase().trim();

    // Handle "weather in chicago" pattern
    const weatherInMatch = q.match(/weather\s+in\s+(.+)/i);
    if (weatherInMatch) {
        return weatherInMatch[1].trim();
    }

    // Handle "chicago weather" pattern
    const cityWeatherMatch = q.match(/(.+?)\s+weather/i);
    if (cityWeatherMatch) {
        return cityWeatherMatch[1].trim();
    }

    // Handle just "weather chicago" pattern
    const weatherCityMatch = q.match(/weather\s+(.+)/i);
    if (weatherCityMatch) {
        return weatherCityMatch[1].trim();
    }

    return 'New York'; // default
};

// Check if query is a math expression
export const isMathQuery = (query) => {
    const q = query.trim();
    // Only allow digits, operators, parentheses, spaces, decimal points
    const mathPattern = /^[\d\s+\-*/().]+$/;
    if (!mathPattern.test(q)) return false;
    // Must have at least one operator
    return /[+\-*/]/.test(q);
};

// Safely evaluate math expression (no eval!)
export const evaluateMath = (query) => {
    try {
        const q = query.trim();
        // Validate again
        if (!/^[\d\s+\-*/().]+$/.test(q)) return null;

        // Use Function constructor with strict validation
        // This is safer than eval but still evaluates only math
        const sanitized = q.replace(/[^0-9+\-*/().]/g, '');

        // Additional safety: check for balanced parentheses
        let depth = 0;
        for (const char of sanitized) {
            if (char === '(') depth++;
            if (char === ')') depth--;
            if (depth < 0) return null;
        }
        if (depth !== 0) return null;

        // Evaluate using Function (safer than eval, no access to scope)
        const result = new Function(`return (${sanitized})`)();

        if (typeof result !== 'number' || !isFinite(result)) return null;
        return result;
    } catch {
        return null;
    }
};

// Check if query is asking for time
export const isTimeQuery = (query) => {
    const q = query.toLowerCase().trim();
    return q.startsWith('time in') || q.startsWith('what time') || q.includes('current time');
};

// Extract location from time query
export const extractTimeLocation = (query) => {
    const q = query.toLowerCase().trim();
    return q.replace(/time in/gi, '').replace(/what time/gi, '').replace(/current time/gi, '').replace(/is it in/gi, '').trim() || 'UTC';
};

// Check if query is a definition request
export const isDefineQuery = (query) => {
    const q = query.toLowerCase().trim();
    return q.startsWith('define') || q.startsWith('what is') || q.startsWith('meaning of');
};

// Extract word to define
export const extractDefineWord = (query) => {
    const q = query.toLowerCase().trim();
    return q.replace(/define/gi, '').replace(/what is/gi, '').replace(/meaning of/gi, '').replace(/the/gi, '').trim();
};

// Check if query should show knowledge card
export const isKnowledgeQuery = (query) => {
    const knowledgeTopics = [
        'tesla', 'india', 'python', 'javascript', 'react', 'google', 'apple', 'microsoft', 'amazon', 'facebook',
        'elon', 'elon musk', 'musk',
        'trump', 'donald trump', 'president trump',
        'sudesh', 'sudesh kumar',
    ];
    const q = query.toLowerCase().trim();
    return knowledgeTopics.some(topic => q === topic || q.includes(topic));
};

// Check if query is a greeting
export const isGreetingQuery = (query) => {
    const greetings = ['hi', 'hello', 'hey', 'howdy', 'hola', 'good morning', 'good afternoon', 'good evening', 'how are you', 'whats up', "what's up", 'sup'];
    const q = query.toLowerCase().trim();
    return greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + ',') || q.startsWith(g + '!'));
};

// Get greeting response
export const getGreetingResponse = (query) => {
    const q = query.toLowerCase().trim();

    if (q.includes('how are you')) {
        return "I'm doing well—thanks for asking! What would you like to search for?";
    }
    if (q.includes('good morning')) {
        return "Good morning! ☀️ What can I help you find today?";
    }
    if (q.includes('good afternoon')) {
        return "Good afternoon! What can I help you find?";
    }
    if (q.includes('good evening')) {
        return "Good evening! 🌙 What can I help you find?";
    }
    if (q.includes('whats up') || q.includes("what's up") || q === 'sup') {
        return "Not much! Just here to help you search. What are you looking for?";
    }
    // Default for hi/hello/hey
    return "Hi there! 👋 How can I help you today?";
};

// Validate URL
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Safe open URL
export const safeOpenUrl = (url) => {
    if (isValidUrl(url)) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return true;
    }
    return false;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    isWeatherQuery,
    extractCity,
    isMathQuery,
    evaluateMath,
    isTimeQuery,
    extractTimeLocation,
    isDefineQuery,
    extractDefineWord,
    isKnowledgeQuery,
    isGreetingQuery,
    getGreetingResponse,
    isValidUrl,
    safeOpenUrl,
};

