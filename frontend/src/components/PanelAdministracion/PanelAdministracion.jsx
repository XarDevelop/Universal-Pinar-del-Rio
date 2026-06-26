import { useState } from "react"
import PapeleraButton from "../PapeleraButton/PapeleraButton"
import './PanelAdministracion.css'
import ModalAgregarUsuario from "../ModalAgregarUsuario/ModalAgregarUsuario";
import ModalEliminarUsuario from "../ModalEliminarUsuario/ModalEliminarUsuario";

export default function PanelAdministracion() {
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const toggleAgregar = () => {
    setMostrarEliminar(false);
    setMostrarAgregar(!mostrarAgregar);
  }

  const toggleEliminar = () => {
    setMostrarAgregar(false);
    setMostrarEliminar(!mostrarEliminar);
  }

  return (
    <div className="admin-section">
      <h2>Panel de Administrador</h2>
      
      <div className="buttons-row">
        <button
          className={`admin-btn ${mostrarAgregar ? 'active' : ''}`}
          onClick={toggleAgregar}
        >
          Agregar Usuario
        </button>

        <button 
          className={`admin-btn btn-danger ${mostrarEliminar ? 'active' : ''}`}
          onClick={toggleEliminar}
        >
          Eliminar Usuario
        </button>

        <PapeleraButton />
      </div>

      {/* Modal Agregar - aparece debajo de los botones */}
      <div className={`modal-wrapper ${mostrarAgregar ? 'visible' : ''}`}>
        <ModalAgregarUsuario onClose={() => setMostrarAgregar(false)} />
      </div>

      {/* Modal Eliminar - aparece debajo de los botones */}
      <div className={`modal-wrapper ${mostrarEliminar ? 'visible' : ''}`}>
        <ModalEliminarUsuario onClose={() => setMostrarEliminar(false)} />
      </div>
    </div>
  )
}