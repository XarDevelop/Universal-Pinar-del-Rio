import LogoutButton from '../LogoutButton/LogoutButton';
import './SectionMenu.css';

const SectionMenu = ({ 
  sections, 
  activeSection, 
  onSectionClick, 
  onLogout,
  showLogout = true,
  isOpen,
  onClose
}) => {
  
  // ← FUNCIÓN PARA CERRAR SIN PROPAGACIÓN
  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Overlay para cerrar al hacer click fuera */}
      <div 
        className={`menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      
      <nav 
        className={`menu-section ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()} // ← EVITA QUE CLICKS DENTRO CIERREN EL MENÚ
      >
        {/* Header del menú con botón de cerrar */}
        <div className="menu-header">
          <span className="menu-title">Menú</span>
          <button 
            className="menu-close-btn"
            onClick={handleClose}  // ← USA LA FUNCIÓN CON stopPropagation
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="menu-container">
          <ul className="menu-list">
            {sections.map((section, index) => (
              <li 
                key={section.id_seccion}
                className={`menu-item ${activeSection === section.id_seccion ? 'active' : ''}`}
                onClick={() => onSectionClick(section.id_seccion)}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{section.nombre_seccion}</span>
              </li>
            ))}
          </ul>
          
          {showLogout && (
            <LogoutButton onLogout={onLogout} />
          )}
        </div>
      </nav>
    </>
  );
};

export default SectionMenu;