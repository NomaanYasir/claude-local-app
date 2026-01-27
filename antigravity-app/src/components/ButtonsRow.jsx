import React from 'react';
import './ButtonsRow.css';

const ButtonsRow = ({ style, className = '', onSearch, onLucky, onToast }) => {
    const handleSearch = () => {
        onSearch?.();
        onToast?.('Search triggered!', 'info');
    };

    const handleLucky = () => {
        onLucky?.();
        onToast?.("I'm Feeling Lucky! 🍀", 'success');
    };

    return (
        <div className={`buttons-row ${className}`} style={style}>
            <button
                className="google-btn"
                onClick={handleSearch}
                aria-label="Google Search"
            >
                Google Search
            </button>
            <button
                className="google-btn lucky-btn"
                onClick={handleLucky}
                aria-label="I'm Feeling Lucky"
            >
                I'm Feeling Lucky
            </button>
        </div>
    );
};

export default ButtonsRow;
