import React from 'react';
import { evaluateMath } from '../utils/queryParser';
import './CalculatorCard.css';

const CalculatorCard = ({ expression }) => {
    const result = evaluateMath(expression);

    if (result === null) {
        return null;
    }

    // Format result nicely
    const formattedResult = Number.isInteger(result)
        ? result.toString()
        : result.toFixed(6).replace(/\.?0+$/, '');

    return (
        <div className="calculator-card">
            <div className="calc-display">
                <div className="calc-expression">{expression}</div>
                <div className="calc-result">= {formattedResult}</div>
            </div>
            <div className="calc-label">Calculator</div>
        </div>
    );
};

export default CalculatorCard;
