import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ minimal = false }) => {
    return (
        <header className={`header ${minimal ? 'header-minimal' : ''}`}>
            <div className="header-left">
                {!minimal && (
                    <>
                        <a href="#about" className="header-link" onClick={(e) => e.preventDefault()}>About</a>
                        <a href="#store" className="header-link" onClick={(e) => e.preventDefault()}>Store</a>
                    </>
                )}
                {minimal && (
                    <Link to="/" className="header-logo">
                        <span className="logo-g">G</span>
                        <span className="logo-o1">o</span>
                        <span className="logo-o2">o</span>
                        <span className="logo-g2">g</span>
                        <span className="logo-l">l</span>
                        <span className="logo-e">e</span>
                    </Link>
                )}
            </div>
            <div className="header-right">
                <a href="#gmail" className="header-link" onClick={(e) => e.preventDefault()}>Gmail</a>
                <a href="#images" className="header-link" onClick={(e) => e.preventDefault()}>Images</a>
                <button className="labs-button" aria-label="Search Labs">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#5f6368" d="M13 11.33L18 18H6l5-6.67V6h2v5.33zM15.96 4H8.04c-.42 0-.65.48-.39.81L9 6.5v4.17L3.2 18.4c-.49.66-.02 1.6.8 1.6h16c.82 0 1.29-.94.8-1.6L15 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81z" />
                    </svg>
                </button>
                <button className="apps-button" aria-label="Google apps">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#5f6368" d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z" />
                    </svg>
                </button>
                <button className="avatar-button" aria-label="User account">
                    <div className="avatar">U</div>
                </button>
            </div>
        </header>
    );
};

export default Header;
