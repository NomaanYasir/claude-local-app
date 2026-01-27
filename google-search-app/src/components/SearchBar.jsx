import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './SearchBar.css';

const MAX_LENGTH = 120;

const SearchBar = ({
    initialValue = '',
    autoFocus = false,
    onSearch,
    size = 'large',
    showError = true,
}) => {
    const [query, setQuery] = useState(initialValue);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useLocalStorage('recent-searches', []);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Filter suggestions based on query
    useEffect(() => {
        if (query.trim() && recentSearches.length > 0) {
            const filtered = recentSearches
                .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5);
            setSuggestions(filtered);
        } else if (!query.trim()) {
            setSuggestions(recentSearches.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [query, recentSearches]);

    const saveSearch = (searchQuery) => {
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
        setRecentSearches(updated);
    };

    const handleSearch = (searchQuery = query) => {
        const q = searchQuery.trim();
        if (!q) {
            setError('Please enter a search query');
            return;
        }
        setError('');
        saveSearch(q);
        setShowSuggestions(false);

        if (onSearch) {
            onSearch(q);
        } else {
            navigate(`/search?q=${encodeURIComponent(q)}`);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_LENGTH) {
            setQuery(value);
            setError('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSearch(suggestions[selectedIndex]);
            } else {
                handleSearch();
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    return (
        <div className={`search-bar-wrapper ${size}`}>
            <div className={`search-bar ${showSuggestions && suggestions.length > 0 ? 'has-suggestions' : ''}`}>
                <div className="search-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#9aa0a6" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder=""
                    aria-label="Search"
                    maxLength={MAX_LENGTH}
                    autoComplete="off"
                />

                <div className="search-icons-right">
                    {query && (
                        <button
                            className="clear-btn"
                            onClick={() => setQuery('')}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                    <div className="divider"></div>
                    <button className="voice-btn" aria-label="Voice search">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="#4285f4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path fill="#ea4335" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    </button>
                    <button className="lens-btn" aria-label="Search by image">
                        <svg viewBox="0 0 192 192" width="24" height="24">
                            <rect fill="none" height="192" width="192" />
                            <g>
                                <circle fill="#4285f4" cx="96" cy="104.15" r="28" />
                                <path fill="#ea4335" d="M160,72v40.15V136c0,1.69-0.34,3.29-0.82,4.82v0v0c-1.57,4.92-5.43,8.78-10.35,10.35h0v0 c-1.53,0.49-3.13,0.82-4.82,0.82H48c-1.69,0-3.29-0.34-4.82-0.82h0v0c-4.92-1.57-8.78-5.43-10.35-10.35v0v0 C32.34,139.29,32,137.69,32,136v-23.85V72c0-1.69,0.34-3.29,0.82-4.82v0c1.57-4.92,5.43-8.78,10.35-10.35h0 C44.71,56.34,46.31,56,48,56h40.15H136c1.69,0,3.29,0.34,4.82,0.82c4.92,1.57,8.78,5.43,10.35,10.35 C159.66,68.71,160,70.31,160,72z" />
                                <path fill="#4285f4" d="M144,40h-12V28c0-6.62-5.38-12-12-12c-6.62,0-12,5.38-12,12v12H96c-6.62,0-12,5.38-12,12 c0,6.62,5.38,12,12,12h12v12c0,6.62,5.38,12,12,12c6.62,0,12-5.38,12-12V64h12c6.62,0,12-5.38,12-12C156,45.38,150.62,40,144,40z" />
                                <path fill="#fbbc04" d="M144,40h-12V28c0-6.62-5.38-12-12-12c-6.62,0-12,5.38-12,12v12H96c-6.62,0-12,5.38-12,12 c0,6.62,5.38,12,12,12h12v12c0,6.62,5.38,12,12,12c6.62,0,12-5.38,12-12V64h12c6.62,0,12-5.38,12-12C156,45.38,150.62,40,144,40z" />
                            </g>
                        </svg>
                    </button>
                    <button className="ai-mode-btn" aria-label="AI Mode">
                        <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '4px' }}>
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z" />
                        </svg>
                        AI Mode
                    </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions" role="listbox">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={suggestion}
                                className={`suggestion ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => handleSuggestionClick(suggestion)}
                                role="option"
                                aria-selected={index === selectedIndex}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="#9aa0a6" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18z" />
                                </svg>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showError && error && (
                <p className="search-error" role="alert">{error}</p>
            )}
        </div>
    );
};

export default SearchBar;
