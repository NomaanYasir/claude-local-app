import React from 'react';
import './OfflineBanner.css';

const OfflineBanner = ({ isOffline }) => {
    if (!isOffline) return null;

    return (
        <div className="offline-banner" role="alert">
            <span>📡 You are offline - Some features may be limited</span>
        </div>
    );
};

export default OfflineBanner;
