import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-content">
                <div className="hero-text animate-fade-in">
                    <h2 className="greeting">👋 Hello, I'm</h2>
                    <h1 className="name">Sameer</h1>
                    <h3 className="role">☕ Java Developer</h3>
                    <p className="tagline">
                        🚀 Building robust backends, 🌍 exploring the world, and 🍜 tasting every flavor along the way.
                    </p>
                    <div className="hero-cta">
                        <a href="#projects" className="btn btn-primary">View My Work</a>
                        <a href="#contact" className="btn btn-outline">Get In Touch</a>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* Abstract geometric representation of code/java */}
                    <div className="code-block">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line short"></div>
                        <div className="line"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
