import { useState } from 'react'
import './ModalAgregarUsuario.css'
import axios from 'axios'

export default function ModalAgregarUsuario({ onClose }) {
    const [usuario_a_agregar, setUsuario_a_agregar] = useState('');
    const [clave_a_agregar, setClave_a_agregar] = useState('');
    const [es_representante, setEs_representante] = useState(false);
    const [id_seccion, setIdSeccion] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const HandleSubmitAgregar = async (e) => {
        e.preventDefault();
        
        if (!usuario_a_agregar.trim() || !clave_a_agregar.trim()) {
            setError('Usuario y contraseña son obligatorios');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post('/api/admin/addUser', {
                username: usuario_a_agregar,
                password: clave_a_agregar,
                esRepresentante: es_representante,
                idSeccion: id_seccion
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            setUsuario_a_agregar('');
            setClave_a_agregar('');
            setEs_representante(false);
            setIdSeccion(1);
            
            onClose();
            
        } catch (error) {
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
        <div className='modal-form'>
            {error && (
                <div className="form-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                </div>
            )}
            
            <form onSubmit={HandleSubmitAgregar}>
                <div className='form-row'>
                    <label>Nombre de usuario:</label>
                    <input 
                        value={usuario_a_agregar}
                        onChange={(e) => setUsuario_a_agregar(e.target.value)} 
                        type="text" 
                        placeholder="Ingrese nombre de usuario"
                        required
                    />
                </div>

                <div className='form-row'>
                    <label>Clave de usuario:</label>
                    <input 
                        value={clave_a_agregar}
                        onChange={(e) => setClave_a_agregar(e.target.value)} 
                        type="password"
                        placeholder="Ingrese contraseña"
                        required
                    />
                </div>

                <div className='form-row-two'>
                    <div className='form-row'>
                        <label>Es representante:</label>
                        <select 
                            value={es_representante ? "True" : "False"}
                            onChange={CambiarSerRepresentante}
                        >
                            <option value="True">Sí</option>
                            <option value="False">No</option>
                        </select>
                    </div>

                    <div className='form-row'>
                        <label>Sección:</label>
                        <select 
                            value={id_seccion}
                            onChange={CambiarSeccion}
                        >
                            <option value="1">Dirección - Cuadro</option>
                            <option value="2">Dirección - Asesoría Jurídica</option>
                            <option value="3">Dirección - Dirección Adjunta</option>
                            <option value="4">Dirección - Informática</option>
                            <option value="5">Organización - Organización</option>
                            <option value="6">Organización - Control Interno</option>
                            <option value="7">Organización - Seguridad</option>
                            <option value="8">Técnica y desarrollo</option>
                            <option value="9">Contable financiero</option>
                            <option value="10">Capital Humano</option>
                            <option value="11">Comercial</option>
                            <option value="12">Transporte</option>
                            <option value="13">Operadora de Almacenes</option>
                        </select>
                    </div>
                </div>

                <div className='form-actions'>
                    <button type='button' className='btn-cancel' onClick={onClose}>
                        Cancelar
                    </button>
                    <button className='btn-submit' type='submit' disabled={loading}>
                        {loading ? 'Agregando...' : 'Agregar'}
                    </button>
                </div>
            </form>
        </div>
    )
}