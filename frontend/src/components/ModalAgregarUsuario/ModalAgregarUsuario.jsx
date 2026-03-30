import { useState } from 'react'
import './ModalAgregarUsuario.css'
import axios from 'axios'

export default function ModalAgregarUsuario({ onClose }) {
    const [usuario_a_agregar, setUsuario_a_agregar] = useState('');
    const [clave_a_agregar, setClave_a_agregar] = useState('');
    const [es_representante, setEs_representante] = useState(false);
    const [id_seccion, setIdSeccion] = useState(1); // Cambiado a 1 ( primera opción válida)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const HandleSubmitAgregar = async (e) => {
        e.preventDefault(); // 🟢 Evita recarga de página
        
        // 🟢 Validaciones básicas
        if (!usuario_a_agregar.trim() || !clave_a_agregar.trim()) {
            setError('Usuario y contraseña son obligatorios');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token'); // 🟢 Obtener token
            
            const response = await axios.post('/api/admin/addUser', {
                username: usuario_a_agregar,
                password: clave_a_agregar,
                esRepresentante: es_representante,
                idSeccion: id_seccion
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // 🟢 Agregar autorización
                }
            });

            console.log('Usuario creado:', response.data);
            
            // 🟢 Limpiar formulario
            setUsuario_a_agregar('');
            setClave_a_agregar('');
            setEs_representante(false);
            setIdSeccion(1);
            
            // 🟢 Cerrar modal automáticamente (opcional)
            onClose();
            
        } catch (error) {
            console.error('Error creando usuario:', error);
            setError(error.response?.data?.message || 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    }

    const CambiarSerRepresentante = (e) => {
        setEs_representante(e.target.value === "True");
    }

    const CambiarSeccion = (e) => {
        setIdSeccion(Number(e.target.value))
    }

    return (
        <div className='search-modal-overlay'>
            <div className='search-modal'>
                <div className='search-modal-header'>
                    <h3>Agregar Usuarios</h3>
                    <button className='close-modal' onClick={onClose}>×</button>
                </div>
                
                <div>
                    {/* 🟢 Mostrar error si existe */}
                    {error && (
                        <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
                            {error}
                        </div>
                    )}
                    
                    <form className='form-field' onSubmit={HandleSubmitAgregar}>
                        <label htmlFor="name">Nombre de usuario:</label>
                        <input 
                            id="name"
                            value={usuario_a_agregar}
                            onChange={(e) => setUsuario_a_agregar(e.target.value)} 
                            type="text" 
                            required
                        />
                        <br />

                        <label htmlFor="password">Clave de usuario:</label>
                        <input 
                            id="password"
                            value={clave_a_agregar}
                            onChange={(e) => setClave_a_agregar(e.target.value)} 
                            type="password"  // 🟢 Cambiado a password para ocultar
                            required
                        />
                        <br />

                        <label htmlFor="is_represented">Es representante:</label>
                        <select 
                            id="is_represented"
                            value={es_representante ? "True" : "False"}
                            onChange={CambiarSerRepresentante}
                        >
                            <option value="True">Sí</option>
                            <option value="False">No</option>
                        </select>
                        <br />

                        <label htmlFor="section">Sección perteneciente:</label>
                        <select 
                            id="section"
                            value={id_seccion}
                            onChange={CambiarSeccion}
                        >
                            <option value="1">Dirección - Cuadro</option>
                            <option value="2">Dirección - Asesoría Jurídica</option>
                            <option value="3">Dirección - Dirección Adjunta</option>
                            <option value="4">Dirección - Informática</option>
                            <option value="5">Organización, Fiscalización y Control - Organización</option>
                            <option value="6">Organización, Fiscalización y Control - Control Interno</option>
                            <option value="7">Organización, Fiscalización y Control - Seguridad y Protección, Seguridad Informática</option>
                            <option value="8">Técnica y desarrollo</option>
                            <option value="9">Contable financiero</option>
                            <option value="10">Capital Humano</option>
                            <option value="11">Comercial</option>
                            <option value="12">Transporte</option>
                            <option value="13">Operadora de Almacenes</option>
                        </select>
                        <br />

                        <button 
                            className='content-add'
                            type='submit'
                            disabled={loading} // 🟢 Deshabilitar mientras carga
                        >
                            {loading ? 'Agregando...' : 'Agregar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}