import './DocumentCard.css';

const DocumentCard = ({ 
  id, 
  name, 
  onDownload, 
  showMeta = true,
  metaLabel = "ID" 
}) => {
  const handleDownload = () => {
    onDownload(id, name);
  };

  return (
    <div className="document-card">
      <div className="document-icon-large">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      
      <div className="document-info">
        <h3 className="document-title" title={name}>{name}</h3>
        {showMeta && <span className="document-meta">{metaLabel}: {id}</span>}
      </div>
      
      <button 
        className="btn-descargar"
        onClick={handleDownload}
        aria-label={`Descargar ${name}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Descargar</span>
      </button>
    </div>
  );
};

export default DocumentCard;