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
        // Convertir archivo a base64
        const reader = new FileReader();
        const documentoBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // ✅ CORREGIDO: Enviar nombre_archivo también
        data = { 
          documento: documentoBase64,
          nombre_archivo: file.name  // ✅ Agregado nombre del archivo
        };
      } else {
        // Enviar ruta
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Documento</h2>
        <p className="seccion-info">Sección: <strong>{seccionNombre}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="file-selected">📄 {file.name}</p>
            ) : isDragActive ? (
              <p>Suelta el archivo aquí...</p>
            ) : (
              <div>
                <p>Arrastra y suelta un archivo aquí</p>
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

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-confirmar"
              disabled={loading || (!file && !rutaManual)}
            >
              {loading ? 'Subiendo...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarDocumento;