import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './TestingChecklist.css';

const CHECKLIST_ITEMS = [
    { id: 'click-buttons', label: 'Click every button' },
    { id: 'normal-input', label: 'Enter normal input text' },
    { id: 'weird-input', label: 'Enter weird inputs (special chars, empty)' },
    { id: 'toggle-gravity', label: 'Toggle gravity/antigravity rapidly' },
    { id: 'resize-screen', label: 'Resize screen (mobile/tablet/desktop)' },
    { id: 'offline-mode', label: 'Turn offline mode on (DevTools)' },
    { id: 'keyboard-nav', label: 'Keyboard navigation (Tab, G/A/R)' },
    { id: 'sliders-test', label: 'Test slider adjustments' },
    { id: 'shake-effect', label: 'Trigger shake effect' },
    { id: 'reset-test', label: 'Reset and verify layout returns' },
];

const TestingChecklist = ({
    isOpen,
    onToggle,
    onTriggerGravity,
    onTriggerAntigravity,
    onTriggerShake,
    onTriggerReset,
}) => {
    const [checkedItems, setCheckedItems] = useLocalStorage('testing-checklist', {});

    const handleCheck = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const resetChecklist = () => {
        setCheckedItems({});
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = CHECKLIST_ITEMS.length;

    return (
        <div className={`testing-checklist ${isOpen ? 'open' : 'closed'}`}>
            <button
                className="checklist-toggle"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close testing checklist' : 'Open testing checklist'}
            >
                📋 Testing ({completedCount}/{totalCount})
            </button>

            {isOpen && (
                <div className="checklist-content">
                    <h3 className="checklist-title">🧪 Testing Checklist</h3>

                    <div className="trigger-buttons">
                        <button onClick={onTriggerGravity} className="trigger-btn">
                            ⬇️ Trigger Gravity
                        </button>
                        <button onClick={onTriggerAntigravity} className="trigger-btn">
                            ⬆️ Trigger Antigravity
                        </button>
                        <button onClick={onTriggerShake} className="trigger-btn">
                            🫨 Trigger Shake
                        </button>
                        <button onClick={onTriggerReset} className="trigger-btn">
                            🔄 Trigger Reset
                        </button>
                    </div>

                    <ul className="checklist-items">
                        {CHECKLIST_ITEMS.map(item => (
                            <li key={item.id} className="checklist-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checkedItems[item.id] || false}
                                        onChange={() => handleCheck(item.id)}
                                    />
                                    <span className={checkedItems[item.id] ? 'checked' : ''}>
                                        {item.label}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>

                    <button className="reset-checklist-btn" onClick={resetChecklist}>
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestingChecklist;
