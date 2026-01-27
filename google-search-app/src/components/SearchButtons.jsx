import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchButtons.css';

const SearchButtons = ({ query, onSearch }) => {
    const navigate = useNavigate();

    const handleSearch = () => {
        if (onSearch) {
            onSearch();
        }
    };

    const handleLucky = () => {
        if (query?.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}&lucky=true`);
        }
    };

    return (
        <div className="search-buttons">
            <button
                className="search-btn"
                onClick={handleSearch}
                aria-label="Google Search"
            >
                Google Search
            </button>
            <button
                className="search-btn lucky-btn"
                onClick={handleLucky}
                aria-label="I'm Feeling Lucky"
            >
                I'm Feeling Lucky
            </button>
        </div>
    );
};

export default SearchButtons;
