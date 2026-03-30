import { useState } from 'react';
import FileDropZone from '../FileDropZone/FileDropZone';
import DocumentPreview from '../DocumentPreview/DocumentPreview';
import './UploadDocument.css';

const UploadDocument = ({ userSection, sectionName, onUploadSuccess }) => {
  const [step, setStep] = useState(1); // 1: Selección, 2: Previsualización
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
    
    // Auto-generar nombre base del documento (sin extensión)
    if (file) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setDocumentName(baseName);
    } else {
      setDocumentName('');
    }
  };

  const handleContinue = () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo primero');
      return;
    }
    if (!documentName.trim()) {
      setError('Por favor ingresa un nombre para el documento');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('nombre_documento', documentName);
    formData.append('id_seccion', userSection);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir documento');
      }

      setSuccess('¡Documento subido exitosamente!');
      
      // Reset después de 2 segundos
      setTimeout(() => {
        setStep(1);
        setSelectedFile(null);
        setDocumentName('');
        setSuccess('');
        if (onUploadSuccess) onUploadSuccess();
      }, 2000);

    } catch (err) {
      throw err; // Lo maneja DocumentPreview
    }
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedFile(null);
    setDocumentName('');
    setError('');
  };

  return (
    <div className="upload-document">
      <div className="upload-header">
        <h2 className="upload-title">📤 Cargar Nuevo Documento</h2>
        <p className="upload-subtitle">
          Sección asignada: <span className="section-highlight">{sectionName}</span>
        </p>
      </div>

      {error && <div className="upload-error">{error}</div>}
      {success && <div className="upload-success">{success}</div>}

      {step === 1 ? (
        <div className="upload-step-1">
          <FileDropZone 
            onFileSelect={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt"
          />

          {selectedFile && (
            <div className="document-name-input">
              <label htmlFor="docName">Nombre del documento:</label>
              <input
                type="text"
                id="docName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Ej: Resolución 2026-001"
                maxLength={100}
              />
              <span className="char-count">{documentName.length}/100</span>
            </div>
          )}

          <button 
            className="continue-btn"
            onClick={handleContinue}
            disabled={!selectedFile}
          >
            Continuar →
          </button>
        </div>
      ) : (
        <DocumentPreview
          file={selectedFile}
          documentName={documentName}
          sectionName={sectionName}
          onConfirm={handleUpload}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UploadDocument;