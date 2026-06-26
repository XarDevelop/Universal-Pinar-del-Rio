import { useState } from 'react';
import './HeroSection.css';

const HeroSection = ({ onMenuToggle, menuOpen }) => {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <div className="hero-left">
          <button 
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          <div className="hero-brand">
            <div className="logo-wrapper">
              <img 
                src="/descarga.jfif" 
                alt="Logo" 
                className="logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <div className="logo-fallback">
                <img 
                    src='/descarga.jfif'
                    alt="Logo" 
                    className="company-logo-header"
            />
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-name">Productos Universales Pinar del Río</span>
              <span className="brand-divider"></span>
              <span className="app-name">Consultor de Resoluciones</span>
            </div>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="deco-circle"></div>
          <div className="deco-ring"></div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;