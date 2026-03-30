import './SearchBar.css'

const SearchBar = ({ 
  onClick,  // ✅ Nueva prop para abrir el modal
  placeholder = "Buscar resoluciones..." 
}) => {
  return (
    <div className="search-section">
      <button 
        className="search-button-trigger"
        onClick={onClick}
        aria-label="Abrir búsqueda"
      >
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <span>{placeholder}</span>
      </button>
    </div>
  );
};

export default SearchBar;