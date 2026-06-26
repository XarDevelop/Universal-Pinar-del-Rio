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
                headers: { "Authorization": `Bearer ${token}` }
            });

            setUsuarioEncontrado(response.data);
            
        } catch (error) {
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
                data: { idUsuario: usuarioEncontrado.id_usuario }
            });

            setNombreEliminado(usuarioEncontrado.nombre_usuario);
            setEliminado(true);
            
            setTimeout(() => {
                onUsuarioEliminado?.();
                onClose();
            }, 2000);
            
        } catch (error) {
            setError(error.response?.data?.message || 'Error al eliminar usuario');
        } finally {
            setLoading(false);
        }
    }

    if (eliminado) {
        alert(`Usuario ${nombreEliminado} eliminado con éxito`)
        setNombreUsuario('')
        setUsuarioEncontrado('');
        setLoading(false)
        setError('')
        setEliminado(false)
        setNombreEliminado('')
    }

    return (
        <div className='modal-form modal-form-danger'>
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
            
            <form onSubmit={HandleSubmitEliminar}>
                <div className='form-row'>
                    <label>Nombre de usuario a eliminar:</label>
                    <div className='search-row'>
                        <input 
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            type="text"
                            placeholder="Ingrese nombre de usuario"
                            disabled={loading}
                        />
                        <button 
                            type="button"
                            className='btn-buscar'
                            onClick={buscarUsuario}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {usuarioEncontrado && (
                    <div className='user-found'>
                        <p><strong>Usuario encontrado:</strong></p>
                        <p className='user-name'>{usuarioEncontrado.nombre_usuario}</p>
                        <p><strong>Sección:</strong> {usuarioEncontrado.nombre_seccion}</p>
                    </div>
                )}

                <p className='confirm-text'>
                    {usuarioEncontrado 
                        ? '¿Está seguro? Esta acción no se puede deshacer.'
                        : 'Busque un usuario para eliminar.'
                    }
                </p>

                <div className='form-actions'>
                    <button type='button' className='btn-cancel' onClick={onClose}>
                        Cancelar
                    </button>
                    <button 
                        className='btn-eliminar' 
                        type='submit'
                        disabled={loading || !usuarioEncontrado}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </form>
        </div>
    )
}