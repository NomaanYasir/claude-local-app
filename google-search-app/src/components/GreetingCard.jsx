import React from 'react';
import { getGreetingResponse } from '../utils/queryParser';
import './GreetingCard.css';

const SUGGESTED_SEARCHES = [
    'weather today',
    'latest news',
    '25 * 4',
    'define algorithm',
    'tesla stock',
];

const GreetingCard = ({ query, onSearch }) => {
    const response = getGreetingResponse(query);

    return (
        <div className="greeting-card" role="region" aria-label="Greeting response">
            <div className="greeting-icon">👋</div>
            <div className="greeting-content">
                <p className="greeting-response">{response}</p>
                <div className="suggested-searches">
                    <span className="suggested-label">Try these searches:</span>
                    <div className="suggested-list">
                        {SUGGESTED_SEARCHES.map((search, index) => (
                            <button
                                key={index}
                                className="suggested-item"
                                onClick={() => onSearch?.(search)}
                                aria-label={`Search for ${search}`}
                            >
                                {search}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GreetingCard;
