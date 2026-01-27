/**
 * Sanitize text to prevent XSS - escape HTML entities
 */
export const safeText = (text) => {
    if (typeof text !== 'string') return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Truncate text to max length with ellipsis
 */
export const truncate = (text, maxLength = 160) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

export default safeText;
