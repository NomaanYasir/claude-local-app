import React, { useState } from 'react';
import './SearchBox.css';

const MAX_LENGTH = 120;

const SearchBox = ({ style, className = '', onSearch, onToast }) => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_LENGTH) {
            setQuery(value);
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a query');
            onToast?.('Please enter a query', 'error');
            return;
        }
        onSearch?.(query);
        onToast?.(`Searching for: ${query}`, 'success');
    };

    const handleLucky = () => {
        onToast?.("I'm Feeling Lucky! 🍀", 'success');
    };

    return (
        <div className={`search-box ${className}`} style={style}>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <span className="search-icon" aria-hidden="true">🔍</span>
                    <input
                        type="text"
                        className={`search-input ${error ? 'search-input-error' : ''}`}
                        value={query}
                        onChange={handleChange}
                        placeholder="Search Antigravity..."
                        aria-label="Search input"
                        maxLength={MAX_LENGTH}
                    />
                    <span className="char-counter" aria-live="polite">
                        {query.length}/{MAX_LENGTH}
                    </span>
                </div>
                {error && <p className="error-message" role="alert">{error}</p>}
            </form>
        </div>
    );
};

export default SearchBox;
