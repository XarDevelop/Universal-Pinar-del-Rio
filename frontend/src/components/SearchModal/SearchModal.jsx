import { useState, useEffect } from 'react';
import './SearchModal.css';

const SearchModal = ({ 
  isOpen, 
  onClose, 
  searchTerm = '',        // ✅ Valor inicial opcional
  onSearchChange,         // ✅ Nueva prop para manejar cambios
  onClear,                // ✅ Nueva prop para limpiar
  results, 
  onDownload, 
  emptyMessage = "Escribe para buscar resoluciones...",
  noResultsMessage = "No se encontraron resoluciones con ese nombre"
}) => {
  // ✅ Estado local para el input (para que el usuario pueda escribir)
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // ✅ Sincronizar con el valor externo cuando se abre
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [isOpen, searchTerm]);

  if (!isOpen) return null;

  const hasSearchTerm = localSearch.trim() !== '';
  const hasResults = results.length > 0;

  // ✅ Handler para cambios en el input
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setLocalSearch(valor);
    if (onSearchChange) {
      onSearchChange(valor);
    }
  };

  // ✅ Handler para limpiar
  const handleClear = () => {
    setLocalSearch('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h3>Buscar Resoluciones</h3>
          <button className="close-modal" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        
        {/* ✅ INPUT DE BÚSQUEDA AGREGADO */}
        <div className="search-modal-input-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-modal-input"
            placeholder="Escribe el nombre del documento..."
            value={localSearch}
            onChange={handleInputChange}
            autoFocus
          />
          {hasSearchTerm && (
            <button 
              className="clear-search-btn"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="search-modal-content">
          {!hasSearchTerm ? (
            <p className="search-hint">{emptyMessage}</p>
          ) : !hasResults ? (
            <p className="no-results">{noResultsMessage}</p>
          ) : (
            <ul className="search-results-list">
              {results.map((doc) => (
                <li key={doc.id_documento} className="search-result-item">
                  <div className="result-info">
                    <svg className="document-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span className="result-name">{doc.nombre_documento}</span>
                  </div>
                  <button 
                    className="btn-descargar-small"
                    onClick={() => onDownload(doc.id_documento, doc.nombre_documento)}
                  >
                    Descargar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;