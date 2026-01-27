import React from 'react';
import './Projects.css';

const Projects = () => {
    const projects = [
        {
            title: '🛒 E-Commerce Microservices',
            description: 'A scalable e-commerce backend built with Spring Boot and Kafka for event-driven architecture.',
            tags: ['Java', 'Spring Boot', 'Kafka', 'Docker'],
            link: '#'
        },
        {
            title: '💳 FinTech Payment Gateway',
            description: 'Secure payment processing integration supporting multiple providers with high transactional integrity.',
            tags: ['Java', 'ACID Compliance', 'Redis', 'PostgreSQL'],
            link: '#'
        },
        {
            title: '✈️ Travel Log API',
            description: 'RESTful API for tracking travel destinations and restaurant reviews.',
            tags: ['Java', 'JPA', 'JWT', 'React'],
            link: '#'
        }
    ];

    return (
        <section id="projects" className="section-padding projects-section">
            <div className="container">
                <h2 className="section-title">🛠️ Featured Projects</h2>
                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div className="project-card" key={index}>
                            <div className="card-header">
                                <h3>{project.title}</h3>
                            </div>
                            <p>{project.description}</p>
                            <div className="card-tags">
                                {project.tags.map(tag => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <a href={project.link} className="project-link">View Code &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
