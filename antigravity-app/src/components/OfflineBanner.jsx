import React from 'react';
import './OfflineBanner.css';

const OfflineBanner = ({ isOffline }) => {
    if (!isOffline) return null;

    return (
        <div className="offline-banner" role="alert" aria-live="assertive">
            <span className="offline-icon">📡</span>
            <span className="offline-text">Offline mode - All features still work!</span>
        </div>
    );
};

export default OfflineBanner;
