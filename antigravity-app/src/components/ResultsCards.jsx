import React from 'react';
import './ResultsCards.css';

const SAMPLE_RESULTS = [
    { id: 1, title: 'What is Antigravity?', description: 'The theoretical concept of creating a place or object that is free from gravity.' },
    { id: 2, title: 'Physics Simulation', description: 'Interactive demos showing gravity, bounce, and floating effects.' },
    { id: 3, title: 'Google Easter Eggs', description: 'Hidden features and fun surprises in Google products.' },
    { id: 4, title: 'CSS Animations', description: 'Creating smooth animations using CSS transforms and keyframes.' },
    { id: 5, title: 'React Hooks', description: 'Custom hooks for state management and side effects.' },
    { id: 6, title: 'Web Physics', description: 'Implementing physics simulations in web browsers.' },
];

const ResultsCards = ({ style, className = '', cardStyles = [] }) => {
    return (
        <div className={`results-cards ${className}`} style={style}>
            {SAMPLE_RESULTS.map((result, index) => (
                <div
                    key={result.id}
                    className="result-card"
                    style={cardStyles[index] || {}}
                >
                    <a href="#" className="result-link" onClick={(e) => e.preventDefault()}>
                        <h3 className="result-title">{result.title}</h3>
                    </a>
                    <p className="result-description">{result.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ResultsCards;
