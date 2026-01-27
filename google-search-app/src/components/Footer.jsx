import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Footer.css';

const Footer = () => {
    const [showTestPanel, setShowTestPanel] = useState(false);
    const [checklist, setChecklist] = useLocalStorage('testing-checklist', {});

    const checklistItems = [
        { id: 'click-buttons', label: 'Click every button' },
        { id: 'input-normal', label: 'Test normal input' },
        { id: 'input-edge', label: 'Test edge cases (empty, long, special chars)' },
        { id: 'resize', label: 'Resize screen (mobile/tablet/desktop)' },
        { id: 'offline', label: 'Test offline mode (DevTools)' },
        { id: 'keyboard', label: 'Keyboard navigation (Tab, Enter, Esc, Arrows)' },
        { id: 'weather', label: 'Test weather query (e.g., "weather chicago")' },
        { id: 'calculator', label: 'Test calculator query (e.g., "25*4")' },
        { id: 'calc-popup', label: 'Calculator popup opens/closes correctly' },
        { id: 'suggestions', label: 'Test suggestions dropdown' },
        { id: 'lucky', label: 'Test I\'m Feeling Lucky' },
        { id: 'result-links', label: 'Click result links opens new tab' },
        { id: 'images-tab', label: 'Images tab shows grid layout' },
        { id: 'greeting', label: 'Greeting queries show Quick Reply (e.g., "hello")' },
        { id: 'offline-weather', label: 'Offline mode shows cached weather fallback' },
    ];

    const toggleCheck = (id) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const completedCount = Object.values(checklist).filter(Boolean).length;

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <a href="#advertising" onClick={(e) => e.preventDefault()}>Advertising</a>
                    <a href="#business" onClick={(e) => e.preventDefault()}>Business</a>
                    <a href="#how" onClick={(e) => e.preventDefault()}>How Search works</a>
                </div>
                <div className="footer-center">
                    <span className="footer-banner">🌱 Applying AI towards science and the environment</span>
                </div>
                <div className="footer-right">
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
                    <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
                    <a href="#settings" onClick={(e) => e.preventDefault()}>Settings</a>
                    <button
                        className="test-panel-toggle"
                        onClick={() => setShowTestPanel(!showTestPanel)}
                        aria-label="Toggle testing panel"
                    >
                        🧪 ({completedCount}/{checklistItems.length})
                    </button>
                </div>
            </div>

            {showTestPanel && (
                <div className="test-panel">
                    <h3>🧪 Testing Checklist</h3>
                    <ul>
                        {checklistItems.map(item => (
                            <li key={item.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checklist[item.id] || false}
                                        onChange={() => toggleCheck(item.id)}
                                    />
                                    <span className={checklist[item.id] ? 'checked' : ''}>
                                        {item.label}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setChecklist({})}>Clear All</button>
                </div>
            )}
        </footer>
    );
};

export default Footer;
