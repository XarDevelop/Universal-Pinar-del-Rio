import React from 'react';
import './TrashedDocumentCard.css';

const TrashedDocumentCard = ({ documento, onRestore, onDelete }) => {
  return (
    <div className="trashed-document-card">
      <span className="document-name">{documento.nombre_documento}</span>
      <div className="document-actions">
        <button 
          className="btn-restore" 
          onClick={() => onRestore(documento.id_documento_desechado)}
        >
          Restaurar
        </button>
        <button 
          className="btn-delete" 
          onClick={() => onDelete(documento.id_documento_desechado)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TrashedDocumentCard;