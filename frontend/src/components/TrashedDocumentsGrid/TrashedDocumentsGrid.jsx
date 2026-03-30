import React from 'react';
import TrashedDocumentCard from '../TrashedDocumentCard/TrashedDocumentCard';
import './TrashedDocumentsGrid.css';

const TrashedDocumentsGrid = ({ documentos, onRestore, onDelete }) => {
  if (documentos.length === 0) {
    return (
      <div className="trashed-grid-empty">
        <p>No hay documentos en la papelera</p>
      </div>
    );
  }

  return (
    <div className="trashed-documents-grid">
      {documentos.map((documento) => (
        <TrashedDocumentCard
          key={documento.id_documento_desechado}
          documento={documento}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TrashedDocumentsGrid;