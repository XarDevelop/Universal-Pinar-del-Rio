import { useState, useCallback } from 'react';
import './FileDropZone.css';

const FileDropZone = ({ onFileSelect, accept = ".pdf,.doc,.docx,.txt" }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file) => {
    const allowedTypes = accept.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'El archivo no debe superar los 10MB' };
    }
    
    if (!allowedTypes.includes(fileExtension)) {
      return { valid: false, error: `Solo se permiten archivos: ${accept}` };
    }
    
    return { valid: true };
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert(validation.error);
      }
    }
  }, [onFileSelect, accept]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert(validation.error);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-drop-zone">
      {!selectedFile ? (
        <div
          className={`drop-area ${isDragActive ? 'active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="drop-icon">📁</div>
          <p className="drop-text">
            {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo aquí'}
          </p>
          <p className="drop-subtext">o</p>
          <label className="file-button">
            Seleccionar archivo
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              hidden
            />
          </label>
          <p className="file-types">Formatos permitidos: {accept}</p>
          <p className="file-size">Tamaño máximo: 10MB</p>
        </div>
      ) : (
        <div className="file-selected">
          <div className="file-info">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button className="clear-file-btn" onClick={clearFile}>
            ✕ Cambiar archivo
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;