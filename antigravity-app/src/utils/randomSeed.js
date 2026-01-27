/**
 * Simple seeded random number generator
 * Useful for reproducible "random" physics effects
 */
export class SeededRandom {
    constructor(seed = Date.now()) {
        this.seed = seed;
    }

    /**
     * Generate next random number between 0 and 1
     */
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * Generate random number in range
     */
    range(min, max) {
        return min + this.next() * (max - min);
    }

    /**
     * Generate random integer in range (inclusive)
     */
    rangeInt(min, max) {
        return Math.floor(this.range(min, max + 1));
    }
}

/**
 * Quick random in range (non-seeded)
 */
export const randomRange = (min, max) => {
    return min + Math.random() * (max - min);
};

export default SeededRandom;
