import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './Tabs.css';

const TABS = [
    { id: 'all', label: 'All', param: '' },
    { id: 'images', label: 'Images', param: 'isch' },
    { id: 'news', label: 'News', param: 'nws' },
    { id: 'videos', label: 'Videos', param: 'vid' },
    { id: 'more', label: 'More', param: '' },
];

const Tabs = ({ activeTab = 'all', onTabChange }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleTabClick = (tab) => {
        const newParams = new URLSearchParams(searchParams);
        if (tab.param) {
            newParams.set('tbm', tab.param);
        } else {
            newParams.delete('tbm');
        }
        setSearchParams(newParams);
        onTabChange?.(tab.id);
    };

    return (
        <nav className="tabs" aria-label="Search result types">
            <div className="tabs-container">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab)}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                        aria-label={`${tab.label} results`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Tabs;
