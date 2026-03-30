import { useState } from "react"
import PapeleraButton from "../PapeleraButton/PapeleraButton"
import './PanelAdministracion.css'
import ModalAgregarUsuario from "../ModalAgregarUsuario/ModalAgregarUsuario";
import ModalEliminarUsuario from "../ModalEliminarUsuario/ModalEliminarUsuario";

export default function PanelAdministracion() {
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const toggleModal = () => {
    setMostrarModalUsuario(!mostrarModalUsuario);
  }

  const toggleModalEliminar = () => {
    setMostrarModalEliminar(!mostrarModalEliminar);
  }
  
  return (
    <div className="admin-section">
        <h2>Panel de Administrador</h2>
        <div className="center-section">
          <button
            className="admin-button"
            onClick={toggleModal}
          >
            Agregar Usuario
          </button>
          
          {mostrarModalUsuario && (
            <ModalAgregarUsuario 
              onClose={toggleModal}
            />
          )}
          
          <button 
            className="admin-button"
            onClick={toggleModalEliminar}
          >
            Eliminar Usuario
          </button>

          {mostrarModalEliminar && (
            <ModalEliminarUsuario 
              onClose={toggleModalEliminar}
            />
          )}
          
          <PapeleraButton />
        </div>
    </div>
  )
}