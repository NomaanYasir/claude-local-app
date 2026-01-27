import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="section-padding contact-section">
            <div className="container contact-container">
                <h2 className="section-title">📬 Get In Touch</h2>
                <p className="contact-subtitle">
                    Interested in working together or just want to discuss the best street food in Asia?
                    Drop me a line!
                </p>

                <div className="contact-content">
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="your@email.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" rows="5" placeholder="Say hello..."></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary submit-btn">Send Message</button>
                    </form>

                    <div className="contact-info">
                        <div className="info-item">
                            <h3>📧 Email</h3>
                            <p>sameer.dev@example.com</p>
                        </div>
                        <div className="info-item">
                            <h3>📞 Phone</h3>
                            <p>708-351-1818</p>
                        </div>
                        <div className="info-item">
                            <h3>📍 Location</h3>
                            <p>Des Plaines, IL</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
