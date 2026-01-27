import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="section-padding about-section">
            <div className="container">
                <h2 className="section-title">👨‍💻 About Me</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p>
                            I'm a Computer Science Engineering graduate and an experienced Java Developer with a deep passion for building scalable, enterprise-grade applications.
                            My expertise lies in the Spring ecosystem, microservices architecture, and cloud-native solutions.
                        </p>
                        <p>
                            When I'm not debugging concurrent threads or optimizing stream pipelines, I'm out exploring the globe or hunting for the next best local dish.
                            I believe that diverse experiences in life translate to better problem-solving in code.
                        </p>

                        <h3 className="skills-title">💻 Programming Languages</h3>
                        <div className="skills-grid languages">
                            <div className="skill-item lang">Java</div>
                            <div className="skill-item lang">C</div>
                            <div className="skill-item lang">C++</div>
                            <div className="skill-item lang">Python</div>
                        </div>

                        <h3 className="skills-title">⚡ Technologies & Frameworks</h3>
                        <div className="skills-grid">
                            <div className="skill-item">Spring Boot</div>
                            <div className="skill-item">Microservices</div>
                            <div className="skill-item">Hibernate</div>
                            <div className="skill-item">AWS</div>
                            <div className="skill-item">Docker</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
