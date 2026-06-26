import { useState } from 'react';
import './ModalDesecharDocumento.css';

const ModalDesecharDocumento = ({ isOpen, onClose, onSubmit }) => {
  const [nombreDocumento, setNombreDocumento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombreDocumento.trim()) {
      alert('Debe ingresar el nombre del documento');
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit(nombreDocumento.trim());
      setNombreDocumento('');
      onClose();
    } catch (error) {
      alert('Error al desechar documento: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombreDocumento('');
    onClose();
  };

  return (
    <div className="modal-form modal-form-danger">
      <div className="modal-form-header">
        <h3>Desechar Documento</h3>
        <span className="warning-badge">⚠️ Papelera</span>
      </div>
      
      <p className="warning-text">
        El documento se moverá a la papelera y ya no estará disponible en la sección.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="nombre-documento">Nombre del documento:</label>
          <input
            id="nombre-documento"
            type="text"
            placeholder="Ej: resolucion_2024.pdf"
            value={nombreDocumento}
            onChange={(e) => setNombreDocumento(e.target.value)}
            autoFocus
          />
        </div>

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
            className="btn-delete"
            disabled={loading || !nombreDocumento.trim()}
          >
            {loading ? 'Desechando...' : 'Desechar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalDesecharDocumento;