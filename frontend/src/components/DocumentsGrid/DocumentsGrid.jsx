import DocumentCard from '../DocumentCard/DocumentCard';
import './DocumentsGrid.css';

const DocumentsGrid = ({ documents, sectionName, onDownload }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="documents-empty">
        <span className="empty-icon">📂</span>
        <p>No hay documentos en esta sección</p>
      </div>
    );
  }

  return (
    <div className="documents-grid">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id_documento}
          id={doc.id_documento}
          name={doc.nombre_documento}
          onDownload={onDownload}
          showMeta={true}
          metaLabel="ID"
        />
      ))}
    </div>
  );
};

export default DocumentsGrid;