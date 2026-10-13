import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p className="footer-text">
          &copy; {currentYear} Bookit. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;