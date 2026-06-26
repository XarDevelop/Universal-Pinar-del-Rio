import { useState } from 'react';
import HeroSection from '../HeroSection/HeroSection';
import SectionMenu from '../SectionMenu/SectionMenu';
import './Layout.css';

const Layout = ({ 
  children, 
  sections, 
  activeSection, 
  onSectionClick, 
  onLogout 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-layout">
      <HeroSection 
        onMenuToggle={toggleMenu} 
        menuOpen={menuOpen} 
      />
      
      <SectionMenu 
        sections={sections}
        activeSection={activeSection}
        onSectionClick={(id) => {
          onSectionClick(id);
          closeMenu();
        }}
        onLogout={onLogout}
        isOpen={menuOpen}
        onClose={closeMenu}
      />

      {/* ← QUITA el onClick={closeMenu} de aquí si causa problemas */}
      <main className="main-content">
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;