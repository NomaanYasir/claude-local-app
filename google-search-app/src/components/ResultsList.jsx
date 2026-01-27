import React from 'react';
import ResultItem from './ResultItem';
import './ResultsList.css';

const ResultsList = ({ results, highlightFirst, onInvalidUrl }) => {
    if (!results || results.length === 0) {
        return (
            <div className="no-results">
                <p>No results found</p>
            </div>
        );
    }

    return (
        <div className="results-list" role="region" aria-label="Search results">
            <p className="results-info">About {results.length * 1000000} results (0.42 seconds)</p>
            {results.map((result, index) => (
                <ResultItem
                    key={result.id}
                    result={result}
                    isHighlighted={highlightFirst && index === 0}
                    onInvalidUrl={onInvalidUrl}
                />
            ))}
        </div>
    );
};

export default ResultsList;
