import React, { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-desechar">
      <div className="modal-content-desechar">
        <h2>Desechar Documento</h2>
        <p className="warning-text">
          ⚠️ El documento se moverá a la papelera y ya no estará disponible en la sección.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombre-documento">Nombre del documento:</label>
            <input
              id="nombre-documento"
              type="text"
              className="nombre-input"
              placeholder="Ej: resolucion_2024.pdf"
              value={nombreDocumento}
              onChange={(e) => setNombreDocumento(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-actions-desechar">
            <button 
              type="button" 
              className="btn-cancelar-desechar" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-confirmar-desechar"
              disabled={loading || !nombreDocumento.trim()}
            >
              {loading ? 'Desechando...' : 'Desechar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDesecharDocumento;