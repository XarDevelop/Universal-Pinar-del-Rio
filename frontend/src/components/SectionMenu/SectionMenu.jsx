import LogoutButton from '../LogoutButton/LogoutButton';
import './SectionMenu.css'
const SectionMenu = ({ 
  sections, 
  activeSection, 
  onSectionClick, 
  onLogout,
  showLogout = true 
}) => {
  return (
    <nav className="menu-section">
      <div className="menu-container">
        <ul className="menu-list">
          {sections.map((section) => (
            <li 
              key={section.id_seccion}
              className={`menu-item ${activeSection === section.id_seccion ? 'active' : ''}`}
              onClick={() => onSectionClick(section.id_seccion)}
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
  );
};

export default SectionMenu;