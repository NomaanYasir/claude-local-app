import React from 'react';
import './TopBar.css';

const TopBar = ({ style, className = '' }) => {
    return (
        <header className={`topbar ${className}`} style={style}>
            <h1 className="logo">
                <span className="logo-letter" style={{ color: '#4285F4' }}>A</span>
                <span className="logo-letter" style={{ color: '#EA4335' }}>n</span>
                <span className="logo-letter" style={{ color: '#FBBC05' }}>t</span>
                <span className="logo-letter" style={{ color: '#4285F4' }}>i</span>
                <span className="logo-letter" style={{ color: '#34A853' }}>g</span>
                <span className="logo-letter" style={{ color: '#EA4335' }}>r</span>
                <span className="logo-letter" style={{ color: '#4285F4' }}>a</span>
                <span className="logo-letter" style={{ color: '#FBBC05' }}>v</span>
                <span className="logo-letter" style={{ color: '#34A853' }}>i</span>
                <span className="logo-letter" style={{ color: '#EA4335' }}>t</span>
                <span className="logo-letter" style={{ color: '#4285F4' }}>y</span>
            </h1>
        </header>
    );
};

export default TopBar;
