import React from 'react';
import './PanelRepresentante.css';

const PanelRepresentante = ({ onAgregar, onDesechar }) => {
  return (
    <div className="panel-representante">
      <h3>Panel de Representante</h3>
      <div className="panel-botones">
        <button className="btn-agregar" onClick={onAgregar}>
          📄 Agregar Documento
        </button>
        <button className="btn-desechar" onClick={onDesechar}>
          🗑️ Desechar Documento
        </button>
      </div>
    </div>
  );
};

export default PanelRepresentante;