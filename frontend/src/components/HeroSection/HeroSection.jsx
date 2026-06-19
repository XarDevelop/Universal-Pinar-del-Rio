import './HeroSection.css'

const HeroSection = () => {
  return (
    <header className="hero-section">
      <div className="hero-content">
        <div className="logo-container">
          <img 
            src="/logo_empresa.png" 
            alt="Logo Empresa" 
            className="logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-placeholder" style={{display: 'none'}}>
            {/* Misma ruta corregida */}
            <img src="/logo_empresa.png" alt="" />
          </div>
        </div>
        <div className="hero-text">
          <h1>Empresa Comercial de Servicios y Productos Universales Pinar del Río</h1>
          <p className="app-subtitle">Consultor de Resoluciones</p>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;