import React from 'react';
import { safeText, truncate } from '../utils/safeText';
import { safeOpenUrl, isValidUrl } from '../utils/queryParser';
import './ResultItem.css';

const ResultItem = ({ result, isHighlighted, onInvalidUrl }) => {
    const handleClick = (e) => {
        e.preventDefault();

        if (!isValidUrl(result.url)) {
            onInvalidUrl?.('Invalid URL - cannot open this link');
            return;
        }

        safeOpenUrl(result.url);
    };

    return (
        <article className={`result-item ${isHighlighted ? 'highlighted' : ''}`}>
            <div className="result-url-row">
                <span className="result-favicon">🌐</span>
                <span className="result-url">{safeText(result.displayUrl)}</span>
            </div>
            <h3 className="result-title">
                <a
                    href={result.url}
                    onClick={handleClick}
                    role="link"
                    aria-label={`Open ${result.title} in new tab`}
                >
                    {safeText(result.title)}
                </a>
            </h3>
            <p className="result-snippet">{truncate(safeText(result.snippet), 160)}</p>
        </article>
    );
};

export default ResultItem;
