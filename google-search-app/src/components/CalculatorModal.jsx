import React, { useState, useEffect, useCallback } from 'react';
import { evaluateMath } from '../utils/queryParser';
import './CalculatorModal.css';

const BUTTONS = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
];

const CalculatorModal = ({ isOpen, onClose, initialExpression = '' }) => {
    const [expression, setExpression] = useState(initialExpression);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && initialExpression) {
            setExpression(initialExpression);
            const res = evaluateMath(initialExpression);
            if (res !== null) setResult(res);
        }
    }, [isOpen, initialExpression]);

    const handleButton = useCallback((btn) => {
        setError('');

        if (btn === 'C') {
            setExpression('');
            setResult(null);
            return;
        }

        if (btn === '⌫') {
            setExpression(prev => prev.slice(0, -1));
            setResult(null);
            return;
        }

        if (btn === '=') {
            // Validate expression
            const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/');
            if (!/^[\d\s+\-*/().]+$/.test(normalized)) {
                setError('Invalid characters. Only numbers and +−×÷.() allowed.');
                return;
            }

            const res = evaluateMath(normalized);
            if (res === null) {
                setError('Invalid expression');
            } else {
                setResult(res);
            }
            return;
        }

        // Map display symbols to operators
        let char = btn;
        if (btn === '×') char = '*';
        if (btn === '÷') char = '/';

        setExpression(prev => prev + btn);
        setResult(null);
    }, [expression]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === 'Enter') {
            handleButton('=');
            return;
        }

        // Allow typing numbers and operators
        if (/^[\d+\-*/().=]$/.test(e.key)) {
            if (e.key === '=') {
                handleButton('=');
            } else {
                setExpression(prev => prev + e.key);
                setResult(null);
            }
        }

        if (e.key === 'Backspace') {
            handleButton('⌫');
        }
    }, [isOpen, onClose, handleButton]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    const formattedResult = result !== null
        ? (Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, ''))
        : null;

    return (
        <div className="calculator-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Calculator">
            <div className="calculator-modal" onClick={e => e.stopPropagation()}>
                <div className="calc-header">
                    <h2>Calculator</h2>
                    <button className="calc-close" onClick={onClose} aria-label="Close calculator">
                        ✕
                    </button>
                </div>

                <div className="calc-display">
                    <div className="calc-expression">{expression || '0'}</div>
                    {formattedResult !== null && (
                        <div className="calc-result">= {formattedResult}</div>
                    )}
                    {error && <div className="calc-error">{error}</div>}
                </div>

                <div className="calc-buttons">
                    {BUTTONS.map((row, rowIndex) => (
                        <div key={rowIndex} className="calc-row">
                            {row.map((btn) => (
                                <button
                                    key={btn}
                                    className={`calc-btn ${btn === '=' ? 'calc-equals' : ''} ${btn === 'C' ? 'calc-clear' : ''}`}
                                    onClick={() => handleButton(btn)}
                                    aria-label={btn === '⌫' ? 'Backspace' : btn === 'C' ? 'Clear' : btn}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <p className="calc-hint">Press Enter to calculate, Esc to close</p>
            </div>
        </div>
    );
};

export default CalculatorModal;
