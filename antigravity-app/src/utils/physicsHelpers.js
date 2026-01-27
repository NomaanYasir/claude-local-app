import { clamp } from './clamp';
import { randomRange } from './randomSeed';

/**
 * Physics constants
 */
export const PHYSICS_CONFIG = {
    GRAVITY: 0.5,
    ANTIGRAVITY: -0.3,
    BOUNCE_FACTOR: 0.7,
    FRICTION: 0.98,
    DRIFT_SPEED: 0.5,
};

/**
 * Calculate gravity force based on strength (0-100)
 */
export const calculateGravity = (strength) => {
    return (strength / 100) * PHYSICS_CONFIG.GRAVITY;
};

/**
 * Calculate bounce factor based on strength (0-100)
 */
export const calculateBounce = (strength) => {
    return (strength / 100) * PHYSICS_CONFIG.BOUNCE_FACTOR + 0.3;
};

/**
 * Apply gravity to velocity
 */
export const applyGravity = (velocityY, gravity) => {
    return velocityY + gravity;
};

/**
 * Apply antigravity (upward force)
 */
export const applyAntigravity = (velocityY, strength) => {
    const force = (strength / 100) * PHYSICS_CONFIG.ANTIGRAVITY;
    return velocityY + force;
};

/**
 * Apply bounce when hitting boundary
 */
export const applyBounce = (velocity, bounceStrength) => {
    return -velocity * bounceStrength;
};

/**
 * Apply friction to slow down movement
 */
export const applyFriction = (velocity) => {
    return velocity * PHYSICS_CONFIG.FRICTION;
};

/**
 * Generate random drift for floating elements
 */
export const generateDrift = () => {
    return {
        x: randomRange(-PHYSICS_CONFIG.DRIFT_SPEED, PHYSICS_CONFIG.DRIFT_SPEED),
        y: randomRange(-PHYSICS_CONFIG.DRIFT_SPEED, PHYSICS_CONFIG.DRIFT_SPEED),
    };
};

/**
 * Check if element is at rest (velocity near zero)
 */
export const isAtRest = (velocityX, velocityY, threshold = 0.1) => {
    return Math.abs(velocityX) < threshold && Math.abs(velocityY) < threshold;
};

/**
 * Calculate position with boundary constraints
 */
export const constrainToBounds = (position, velocity, min, max, bounceStrength) => {
    let newPosition = position;
    let newVelocity = velocity;

    if (position < min) {
        newPosition = min;
        newVelocity = applyBounce(velocity, bounceStrength);
    } else if (position > max) {
        newPosition = max;
        newVelocity = applyBounce(velocity, bounceStrength);
    }

    return { position: newPosition, velocity: newVelocity };
};

/**
 * Generate shake offset
 */
export const generateShakeOffset = (intensity = 10) => {
    return {
        x: randomRange(-intensity, intensity),
        y: randomRange(-intensity, intensity),
    };
};

export default {
    calculateGravity,
    calculateBounce,
    applyGravity,
    applyAntigravity,
    applyBounce,
    applyFriction,
    generateDrift,
    isAtRest,
    constrainToBounds,
    generateShakeOffset,
    PHYSICS_CONFIG,
};
