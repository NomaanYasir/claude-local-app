import React from 'react';
import { KNOWLEDGE_DATA } from '../utils/mockResults';
import './KnowledgeCard.css';

const KnowledgeCard = ({ topic }) => {
    // Try exact match first, then try matching the topic in the key
    let data = KNOWLEDGE_DATA[topic.toLowerCase()];

    if (!data) {
        // Try to find a partial match
        const keys = Object.keys(KNOWLEDGE_DATA);
        const matchKey = keys.find(k =>
            topic.toLowerCase().includes(k) || k.includes(topic.toLowerCase())
        );
        if (matchKey) data = KNOWLEDGE_DATA[matchKey];
    }

    if (!data) return null;

    return (
        <div className="knowledge-card">
            {data.image && (
                <div className="kc-image-container">
                    <img
                        src={data.image}
                        alt={data.title}
                        className="kc-image"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>
            )}
            <h2 className="kc-title">{data.title}</h2>
            <p className="kc-type">{data.type}</p>
            <p className="kc-description">{data.description}</p>

            <div className="kc-facts">
                {data.facts.map((fact, index) => (
                    <div key={index} className="kc-fact">
                        <span className="kc-fact-label">{fact.label}</span>
                        <span className="kc-fact-value">{fact.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KnowledgeCard;
