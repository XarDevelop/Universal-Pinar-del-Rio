import { useState } from 'react'
import './ModalEliminarUsuario.css'
import axios from 'axios'

export default function ModalEliminarUsuario({ onClose, onUsuarioEliminado }) {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [eliminado, setEliminado] = useState(false);
    const [nombreEliminado, setNombreEliminado] = useState('');

    const buscarUsuario = async () => {
        if (!nombreUsuario.trim()) {
            setError('Ingrese un nombre de usuario');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.get(`/api/admin/usuario/${nombreUsuario}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setUsuarioEncontrado(response.data);
            
        } catch (error) {
            console.error('Error buscando usuario:', error);
            setError('Usuario no encontrado');
            setUsuarioEncontrado(null);
        } finally {
            setLoading(false);
        }
    };

    const HandleSubmitEliminar = async (e) => {
        e.preventDefault();
        
        if (!usuarioEncontrado) {
            setError('Primero busque un usuario válido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            await axios.delete('/api/admin/deleteUser', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    idUsuario: usuarioEncontrado.id_usuario
                }
            });

            setNombreEliminado(usuarioEncontrado.nombre_usuario);
            setEliminado(true);
            
            setTimeout(() => {
                onUsuarioEliminado();
                onClose();
            }, 2000);
            
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            setError(error.response?.data?.message || 'Error al eliminar usuario');
        } finally {
            setLoading(false);
        }
    }

    if (eliminado) {
        alert(`Usuario ${nombreEliminado} con exito `)
    }

    return (
        <div className='search-modal-overlay'>
            <div className='search-modal'>
                <div className='search-modal-header'>
                    <h3>Eliminar Usuario</h3>
                    <button className='close-modal' onClick={onClose}>×</button>
                </div>
                
                <div>
                    {error && (
                        <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
                            {error}
                        </div>
                    )}
                    
                    <form className='form-field' onSubmit={HandleSubmitEliminar}>
                        <label htmlFor="nombre-usuario">Nombre de usuario:</label>
                        <input 
                            id="nombre-usuario"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            type="text"
                            placeholder="Ingrese nombre de usuario a eliminar"
                            disabled={loading}
                        />
                        <br />

                        <button 
                            type="button"
                            className='content-add'
                            onClick={buscarUsuario}
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                        <br />

                        {usuarioEncontrado && (
                            <div className='info-usuario'>
                                <p><strong>Usuario encontrado:</strong></p>
                                <p className='dato-usuario'>{usuarioEncontrado.nombre_usuario}</p>
                                <br />
                                <p><strong>Sección:</strong></p>
                                <p className='dato-usuario'>{usuarioEncontrado.nombre_seccion}</p>
                                <br />
                            </div>
                        )}

                        <p className='confirmacion-texto'>
                            {usuarioEncontrado 
                                ? '¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.'
                                : 'Busque un usuario para eliminar.'
                            }
                        </p>

                        <button 
                            className='content-delete'
                            type='submit'
                            disabled={loading || !usuarioEncontrado}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}