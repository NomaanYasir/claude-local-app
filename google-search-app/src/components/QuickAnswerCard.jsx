import React from 'react';
import { extractTimeLocation, extractDefineWord } from '../utils/queryParser';
import { DEFINITIONS } from '../utils/mockResults';
import './QuickAnswerCard.css';

const QuickAnswerCard = ({ query, type }) => {
    if (type === 'time') {
        const location = extractTimeLocation(query);
        // Mock time - in real app would use timezone API
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return (
            <div className="quick-answer-card">
                <div className="qa-icon">🕐</div>
                <div className="qa-content">
                    <div className="qa-main">{timeString}</div>
                    <div className="qa-sub">Time in {location || 'your location'}</div>
                    <div className="qa-note">* Approximate time (local)</div>
                </div>
            </div>
        );
    }

    if (type === 'define') {
        const word = extractDefineWord(query).toLowerCase();
        const definition = DEFINITIONS[word] || `A term related to "${word}". Definition not found in our database.`;

        return (
            <div className="quick-answer-card">
                <div className="qa-icon">📖</div>
                <div className="qa-content">
                    <div className="qa-word">{word}</div>
                    <div className="qa-definition">{definition}</div>
                </div>
            </div>
        );
    }

    return null;
};

export default QuickAnswerCard;
