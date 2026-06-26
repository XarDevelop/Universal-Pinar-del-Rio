import { useState } from "react"
import './PanelRepresentante.css'
import ModalAgregarDocumento from "../ModalAgregarDocumento/ModalAgregarDocumento";
import ModalDesecharDocumento from "../ModalDesecharDocumento/ModalDesecharDocumento";

export default function PanelRepresentante({ seccionNombre, onAgregarDocumento, onDesecharDocumento }) {
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [mostrarDesechar, setMostrarDesechar] = useState(false);

  const toggleAgregar = () => {
    setMostrarDesechar(false);
    setMostrarAgregar(!mostrarAgregar);
  }

  const toggleDesechar = () => {
    setMostrarAgregar(false);
    setMostrarDesechar(!mostrarDesechar);
  }

  const handleAgregar = async (data) => {
    await onAgregarDocumento(data);
    setMostrarAgregar(false);
  }

  const handleDesechar = async (nombreDocumento) => {
    await onDesecharDocumento(nombreDocumento);
    setMostrarDesechar(false);
  }

  return (
    <div className="representante-section">
      <h2>Panel de Representante</h2>
      
      <div className="buttons-row">
        <button
          className={`admin-btn ${mostrarAgregar ? 'active' : ''}`}
          onClick={toggleAgregar}
        >
          Agregar Documento
        </button>

        <button 
          className={`admin-btn btn-danger ${mostrarDesechar ? 'active' : ''}`}
          onClick={toggleDesechar}
        >
          Desechar Documento
        </button>
      </div>

      {/* Modal Agregar - aparece debajo de los botones */}
      <div className={`modal-wrapper ${mostrarAgregar ? 'visible' : ''}`}>
        <ModalAgregarDocumento 
          isOpen={mostrarAgregar}
          onClose={() => setMostrarAgregar(false)}
          onSubmit={handleAgregar}
          seccionNombre={seccionNombre}
        />
      </div>

      {/* Modal Desechar - aparece debajo de los botones */}
      <div className={`modal-wrapper ${mostrarDesechar ? 'visible' : ''}`}>
        <ModalDesecharDocumento 
          isOpen={mostrarDesechar}
          onClose={() => setMostrarDesechar(false)}
          onSubmit={handleDesechar}
        />
      </div>
    </div>
  )
}