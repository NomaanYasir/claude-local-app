import React from 'react';
import './Hobbies.css';

const Hobbies = () => {
    return (
        <section id="hobbies" className="section-padding hobbies-section">
            <div className="container">
                <h2 className="section-title">Life Beyond Code</h2>

                <div className="hobby-container">
                    {/* Travel Column */}
                    <div className="hobby-col travel">
                        <div className="icon-wrapper">
                            <span className="emoji">✈️</span>
                        </div>
                        <h3>Wanderlust</h3>
                        <p className="hobby-desc">
                            From the bustling streets of Tokyo to the quiet fjords of Norway, I find inspiration in new places.
                            Traveling recharges my creativity and offers fresh perspectives.
                        </p>
                        <ul className="hobby-list">
                            <li>Visited 15+ Countries</li>
                            <li>Solo Backpacking</li>
                            <li>Cultural Immersion</li>
                        </ul>
                    </div>

                    <div className="divider"></div>

                    {/* Food Column */}
                    <div className="hobby-col food">
                        <div className="icon-wrapper">
                            <span className="emoji">🍜</span>
                        </div>
                        <h3>Gastronomy</h3>
                        <p className="hobby-desc">
                            Code needs fuel. I'm a self-proclaimed foodie on a quest for the perfect ramen bowl and the spiciest curry.
                            Cooking on weekends is my form of garbage collection.
                        </p>
                        <ul className="hobby-list">
                            <li>Spicy Food Enthusiast</li>
                            <li>Weekend Chef</li>
                            <li>Coffee Connoisseur</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hobbies;
