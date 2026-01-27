import React from 'react';
import './ImageGrid.css';

// Generate filter chips based on query
const generateFilterChips = (query) => {
    const commonFilters = {
        'trump': ['Wedding', 'Cabinet', 'Dress', 'Hotel', 'Electoral', 'Next', 'Tattoo', 'Crown', 'Tower', 'Office', 'Costume'],
        'elon musk': ['SpaceX', 'Tesla', 'Twitter', 'Young', 'Wedding', 'Family', 'Net Worth', 'House', 'Hair', 'Meme'],
        'sudesh kumar': ['Actor', 'Comedian', 'Movies', 'Family', 'Young', 'Wife', 'Comedy Circus'],
        'default': ['HD', 'Wallpaper', 'Background', 'Logo', 'Icon', 'Transparent', 'Vector', 'Aesthetic', 'Vintage', 'Modern']
    };

    const key = Object.keys(commonFilters).find(k => query.toLowerCase().includes(k));
    return commonFilters[key] || commonFilters['default'];
};

// Generate realistic source names
const generateSources = () => [
    { name: 'Wikipedia', icon: '📘' },
    { name: 'Getty Images', icon: '📷' },
    { name: 'The White House', icon: '🏛️' },
    { name: 'Reuters', icon: '📰' },
    { name: 'AP News', icon: '📰' },
    { name: 'CNN', icon: '📺' },
    { name: 'The New York Times', icon: '📰' },
    { name: 'Biography.com', icon: '📖' },
    { name: 'History.com', icon: '📜' },
    { name: 'Instagram', icon: '📸' },
    { name: 'NPR', icon: '🎙️' },
    { name: 'Forbes', icon: '💼' }
];

// Generate image results using Lorem Picsum (reliable)
const generateImageResults = (query, count = 24) => {
    const results = [];
    const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const sources = generateSources();

    // Title templates based on query
    const capitalizedQuery = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const titleTemplates = [
        `${capitalizedQuery} - Wikipedia`,
        `${capitalizedQuery} - Official Photo`,
        `${capitalizedQuery} at Event`,
        `${capitalizedQuery} - Latest`,
        `${capitalizedQuery} Portrait`,
        `${capitalizedQuery} - Biography`,
        `${capitalizedQuery} - Getty Images`,
        `${capitalizedQuery} Speech`,
        `${capitalizedQuery} Interview`,
        `${capitalizedQuery} - Press Photo`,
        `${capitalizedQuery} - Archive`,
        `${capitalizedQuery} - News`
    ];

    // Size patterns for masonry layout
    const sizePatterns = [
        { width: 200, height: 280 },  // Portrait
        { width: 280, height: 180 },  // Landscape
        { width: 220, height: 220 },  // Square
        { width: 300, height: 200 },  // Wide
        { width: 180, height: 260 },  // Tall portrait
        { width: 260, height: 170 },  // Short landscape
    ];

    for (let i = 0; i < count; i++) {
        const sizeIndex = (seed + i) % sizePatterns.length;
        const { width, height } = sizePatterns[sizeIndex];
        const source = sources[(seed + i) % sources.length];

        // Use Lorem Picsum with deterministic seed based on query
        // This ensures same query always shows same images
        const picId = ((seed + i * 13) % 1000) + 1;
        const imageUrl = `https://picsum.photos/id/${picId}/${width}/${height}`;

        results.push({
            id: `img-${i}-${seed}`,
            url: imageUrl,
            thumbnail: imageUrl,
            title: titleTemplates[i % titleTemplates.length],
            source: source.name,
            sourceIcon: source.icon,
            width,
            height,
            timeAgo: i < 3 ? `${i + 1} days ago` : null
        });
    }

    return results;
};

const ImageGrid = ({ query, onImageClick }) => {
    const images = generateImageResults(query, 24);
    const filterChips = generateFilterChips(query);

    const handleFilterClick = (filter) => {
        console.log('Filter clicked:', filter);
    };

    return (
        <div className="images-container" role="region" aria-label="Image results">
            {/* Filter chips row */}
            <div className="image-filters">
                {filterChips.map((filter, index) => (
                    <button
                        key={filter}
                        className="filter-chip"
                        onClick={() => handleFilterClick(filter)}
                    >
                        <span className="filter-thumb">
                            <img
                                src={`https://picsum.photos/seed/${filter.toLowerCase()}/32/32`}
                                alt=""
                            />
                        </span>
                        <span className="filter-label">{filter}</span>
                    </button>
                ))}
            </div>

            {/* Masonry image grid */}
            <div className="image-grid-masonry">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="image-item-masonry"
                        onClick={() => onImageClick?.(image)}
                        role="button"
                        tabIndex={0}
                        aria-label={image.title}
                        onKeyPress={(e) => e.key === 'Enter' && onImageClick?.(image)}
                    >
                        <div className="image-wrapper-masonry">
                            <img
                                src={image.thumbnail}
                                alt={image.title}
                                loading="lazy"
                            />
                            {image.timeAgo && (
                                <span className="image-time-badge">{image.timeAgo}</span>
                            )}
                        </div>
                        <div className="image-info-masonry">
                            <div className="image-source-row">
                                <span className="source-icon">{image.sourceIcon}</span>
                                <span className="source-name">{image.source}</span>
                            </div>
                            <span className="image-title-masonry">{image.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tools bar */}
            <div className="images-tools-bar">
                <button className="tools-btn">Tools ▾</button>
                <button className="saves-btn">☆ Saves</button>
            </div>
        </div>
    );
};

export default ImageGrid;
