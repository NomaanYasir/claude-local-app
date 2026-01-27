import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import OfflineBanner from './components/OfflineBanner';
import './styles/global.css';
import './App.css';

function App() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <BrowserRouter>
            <OfflineBanner isOffline={isOffline} />
            <div className={`app ${isOffline ? 'offline' : ''}`}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<ResultsPage isOffline={isOffline} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
