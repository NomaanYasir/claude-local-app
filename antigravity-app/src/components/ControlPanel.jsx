import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({
    gravityOn,
    antigravityOn,
    gravityStrength,
    bounceStrength,
    onToggleGravity,
    onToggleAntigravity,
    onGravityStrengthChange,
    onBounceStrengthChange,
    onReset,
    onShake,
    isOpen,
    onTogglePanel,
}) => {
    return (
        <div className={`control-panel ${isOpen ? 'open' : 'closed'}`}>
            <button
                className="panel-toggle"
                onClick={onTogglePanel}
                aria-label={isOpen ? 'Close control panel' : 'Open control panel'}
                aria-expanded={isOpen}
            >
                {isOpen ? '✕' : '⚙️'}
            </button>

            {isOpen && (
                <div className="panel-content">
                    <h2 className="panel-title">⚙️ Controls</h2>

                    <div className="control-group">
                        <label className="control-label">
                            <span>Gravity (G)</span>
                            <button
                                className={`toggle-btn ${gravityOn ? 'active' : ''}`}
                                onClick={onToggleGravity}
                                aria-pressed={gravityOn}
                            >
                                {gravityOn ? 'ON' : 'OFF'}
                            </button>
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="control-label">
                            <span>Antigravity (A)</span>
                            <button
                                className={`toggle-btn ${antigravityOn ? 'active' : ''}`}
                                onClick={onToggleAntigravity}
                                aria-pressed={antigravityOn}
                            >
                                {antigravityOn ? 'ON' : 'OFF'}
                            </button>
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="slider-label">
                            Gravity Strength: {gravityStrength}%
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={gravityStrength}
                                onChange={(e) => onGravityStrengthChange(Number(e.target.value))}
                                className="slider"
                                aria-label="Gravity strength slider"
                            />
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="slider-label">
                            Bounce: {bounceStrength}%
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={bounceStrength}
                                onChange={(e) => onBounceStrengthChange(Number(e.target.value))}
                                className="slider"
                                aria-label="Bounce strength slider"
                            />
                        </label>
                    </div>

                    <div className="control-actions">
                        <button className="action-btn shake-btn" onClick={onShake}>
                            🫨 Shake
                        </button>
                        <button className="action-btn reset-btn" onClick={onReset}>
                            🔄 Reset (R)
                        </button>
                    </div>

                    <div className="shortcuts-info">
                        <p><kbd>G</kbd> Gravity | <kbd>A</kbd> Antigravity</p>
                        <p><kbd>R</kbd> Reset | <kbd>Esc</kbd> Close Panel</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;
