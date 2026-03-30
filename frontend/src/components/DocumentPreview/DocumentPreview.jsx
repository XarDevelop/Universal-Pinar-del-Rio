import { useState } from 'react';
import './DocumentPreview.css';

const DocumentPreview = ({ file, documentName, sectionName, onConfirm, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      txt: '📄',
      default: '📎'
    };
    return icons[ext] || icons.default;
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    
    // Simular progreso (en la implementación real será el progreso de axios)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onConfirm();
      setUploadProgress(100);
    } catch (error) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="document-preview">
      <h3 className="preview-title">Previsualización del documento</h3>
      
      <div className="preview-card">
        <div className="preview-icon">{getFileIcon(file.name)}</div>
        
        <div className="preview-details">
          <div className="detail-row">
            <span className="detail-label">Nombre archivo:</span>
            <span className="detail-value">{file.name}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Tamaño:</span>
            <span className="detail-value">{formatFileSize(file.size)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Tipo:</span>
            <span className="detail-value">{file.type || 'Documento'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Sección:</span>
            <span className="detail-value section-badge">{sectionName}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Nombre documento:</span>
            <span className="detail-value doc-name">{documentName}</span>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      <div className="preview-actions">
        <button 
          className="btn-cancel" 
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancelar
        </button>
        <button 
          className="btn-confirm" 
          onClick={handleConfirm}
          disabled={isUploading}
        >
          {isUploading ? 'Subiendo...' : '✓ Confirmar y subir'}
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;