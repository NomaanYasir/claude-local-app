import { useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Object mapping keys to callbacks
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export const useKeyboardShortcuts = (shortcuts, enabled = true) => {
    const handleKeyDown = useCallback(
        (event) => {
            if (!enabled) return;

            // Don't trigger shortcuts when typing in input/textarea
            const tagName = event.target.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                // Only allow Escape in inputs
                if (event.key !== 'Escape') return;
            }

            const key = event.key.toLowerCase();

            if (shortcuts[key]) {
                event.preventDefault();
                shortcuts[key](event);
            }
        },
        [shortcuts, enabled]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
