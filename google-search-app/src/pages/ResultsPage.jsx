import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Tabs from '../components/Tabs';
import ResultsList from '../components/ResultsList';
import WeatherCard from '../components/WeatherCard';
import CalculatorCard from '../components/CalculatorCard';
import CalculatorModal from '../components/CalculatorModal';
import QuickAnswerCard from '../components/QuickAnswerCard';
import KnowledgeCard from '../components/KnowledgeCard';
import GreetingCard from '../components/GreetingCard';
import ImageGrid from '../components/ImageGrid';
import Toast from '../components/Toast';
import { generateMockResults } from '../utils/mockResults';
import {
    isWeatherQuery,
    extractCity,
    isMathQuery,
    isTimeQuery,
    isDefineQuery,
    isKnowledgeQuery,
    isGreetingQuery,
} from '../utils/queryParser';
import './ResultsPage.css';

const ResultsPage = ({ isOffline }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const isLucky = searchParams.get('lucky') === 'true';
    const tabParam = searchParams.get('tbm') || '';

    const [activeTab, setActiveTab] = useState(tabParam === 'isch' ? 'images' : 'all');
    const [results, setResults] = useState([]);
    const [showCalculator, setShowCalculator] = useState(false);
    const [toast, setToast] = useState(null);
    const firstResultRef = useRef(null);

    useEffect(() => {
        // Sync tab with URL param
        if (tabParam === 'isch') setActiveTab('images');
        else if (tabParam === 'nws') setActiveTab('news');
        else if (tabParam === 'vid') setActiveTab('videos');
        else setActiveTab('all');
    }, [tabParam]);

    useEffect(() => {
        if (query) {
            const mockResults = generateMockResults(query, 10);
            setResults(mockResults);
        }
    }, [query]);

    // Handle "I'm Feeling Lucky" - scroll to first result
    useEffect(() => {
        if (isLucky && results.length > 0 && firstResultRef.current) {
            setTimeout(() => {
                firstResultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }, [isLucky, results]);

    const handleSearch = (newQuery) => {
        navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    };

    const showToast = useCallback((message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Determine which special cards to show
    const showWeather = isWeatherQuery(query);
    const showMath = isMathQuery(query);
    const showTime = isTimeQuery(query);
    const showDefine = isDefineQuery(query);
    const showKnowledge = isKnowledgeQuery(query);
    const showGreeting = isGreetingQuery(query);
    const knowledgeTopic = query.toLowerCase().split(' ')[0];

    const handleImageClick = (image) => {
        window.open(image.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="results-page">
            <header className="results-header">
                <Header minimal={true} />
                <div className="results-search-row">
                    <SearchBar
                        initialValue={query}
                        size="small"
                        onSearch={handleSearch}
                    />
                </div>
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
            </header>

            <main className="results-main">
                <div className="results-content">
                    <div className="results-left">
                        {/* Greeting Card */}
                        {activeTab === 'all' && showGreeting && (
                            <GreetingCard query={query} onSearch={handleSearch} />
                        )}

                        {/* Weather Card */}
                        {activeTab === 'all' && showWeather && (
                            <WeatherCard city={extractCity(query)} isOffline={isOffline} />
                        )}

                        {/* Calculator Card */}
                        {activeTab === 'all' && showMath && (
                            <div className="calc-section">
                                <CalculatorCard expression={query} />
                                <button
                                    className="open-calc-btn"
                                    onClick={() => setShowCalculator(true)}
                                    aria-label="Open full calculator"
                                >
                                    🧮 Open Calculator
                                </button>
                            </div>
                        )}

                        {/* Quick Answer Cards */}
                        {activeTab === 'all' && showTime && (
                            <QuickAnswerCard query={query} type="time" />
                        )}
                        {activeTab === 'all' && showDefine && (
                            <QuickAnswerCard query={query} type="define" />
                        )}

                        {/* Tab Content */}
                        {activeTab === 'all' && (
                            <div ref={firstResultRef}>
                                <ResultsList
                                    results={results}
                                    highlightFirst={isLucky}
                                    onInvalidUrl={showToast}
                                />
                            </div>
                        )}

                        {activeTab === 'images' && (
                            <div className="images-tab-content full-width">
                                <ImageGrid query={query} onImageClick={handleImageClick} />
                            </div>
                        )}

                        {activeTab === 'news' && (
                            <div className="coming-soon">
                                <h3>📰 News Results</h3>
                                <p>News tab coming soon! Check back later.</p>
                            </div>
                        )}

                        {activeTab === 'videos' && (
                            <div className="coming-soon">
                                <h3>🎬 Video Results</h3>
                                <p>Videos tab coming soon! Check back later.</p>
                            </div>
                        )}
                    </div>

                    <aside className="results-right">
                        {activeTab === 'all' && showKnowledge && (
                            <KnowledgeCard topic={knowledgeTopic} />
                        )}
                    </aside>
                </div>
            </main>

            <Footer />

            {/* Calculator Modal */}
            <CalculatorModal
                isOpen={showCalculator}
                onClose={() => setShowCalculator(false)}
                initialExpression={showMath ? query : ''}
            />

            {/* Toast Notifications */}
            {toast && (
                <div className="toast-container">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
