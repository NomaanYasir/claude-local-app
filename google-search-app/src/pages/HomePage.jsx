import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import SearchButtons from '../components/SearchButtons';
import './HomePage.css';

const HomePage = () => {
    const [query, setQuery] = useState('');
    const searchBarRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="home-page">
            <Header />

            <main className="home-main">
                <div className="logo-container">
                    <h1 className="home-logo">
                        <span className="logo-g">G</span>
                        <span className="logo-o1">o</span>
                        <span className="logo-o2">o</span>
                        <span className="logo-g2">g</span>
                        <span className="logo-l">l</span>
                        <span className="logo-e">e</span>
                    </h1>
                </div>

                <div className="search-container">
                    <SearchBar
                        ref={searchBarRef}
                        autoFocus={true}
                        onSearch={(q) => {
                            setQuery(q);
                            navigate(`/search?q=${encodeURIComponent(q)}`);
                        }}
                    />
                    <SearchButtons
                        query={query}
                        onSearch={handleSearch}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
