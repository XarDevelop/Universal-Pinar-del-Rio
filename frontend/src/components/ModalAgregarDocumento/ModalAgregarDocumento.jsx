import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './ModalAgregarDocumento.css';

const ModalAgregarDocumento = ({ isOpen, onClose, onSubmit, seccionNombre }) => {
  const [file, setFile] = useState(null);
  const [rutaManual, setRutaManual] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setRutaManual('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !rutaManual) {
      alert('Debe seleccionar un archivo o ingresar una ruta');
      return;
    }

    setLoading(true);
    
    try {
      let data;
      
      if (file) {
        const reader = new FileReader();
        const documentoBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        data = { 
          documento: documentoBase64,
          nombre_archivo: file.name
        };
      } else {
        data = { filePath: rutaManual };
      }

      await onSubmit(data);
      
      setFile(null);
      setRutaManual('');
      onClose();
    } catch (error) {
      alert('Error al agregar documento: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setRutaManual('');
    onClose();
  };

  // Ya no necesitamos isOpen aquí porque el padre controla la visibilidad
  return (
    <div className="modal-form modal-form-upload">
      <div className="modal-form-header">
        <h3>Agregar Documento</h3>
        <span className="seccion-badge">{seccionNombre}</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="file-info">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : isDragActive ? (
            <div className="dropzone-hint">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p>Suelta el archivo aquí</p>
            </div>
          ) : (
            <div className="dropzone-hint">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p>Arrastra y suelta un archivo</p>
              <span className="or-divider">o</span>
              <p className="click-hint">Haz clic para seleccionar</p>
            </div>
          )}
        </div>

        <div className="divider">— o ingresa la ruta manualmente —</div>

        <input
          type="text"
          className="ruta-input"
          placeholder="C:\ruta\del\archivo.pdf"
          value={rutaManual}
          onChange={(e) => {
            setRutaManual(e.target.value);
            if (e.target.value) setFile(null);
          }}
        />

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading || (!file && !rutaManual)}
          >
            {loading ? 'Subiendo...' : 'Agregar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAgregarDocumento;