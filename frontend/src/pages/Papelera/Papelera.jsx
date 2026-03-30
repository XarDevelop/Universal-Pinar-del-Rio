import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchModal from '../../components/SearchModal/SearchModal';
import BackButton from '../../components/BackButton/BackButton';
import TrashedDocumentsGrid from '../../components/TrashedDocumentsGrid/TrashedDocumentsGrid';
import './Papelera.css';

const Papelera = () => {
  const [documentos, setDocumentos] = useState([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // ✅ Estados para búsqueda con nuevo patrón
  const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    cargarPapelera();
  }, [navigate]);

  // Cargar documentos de la papelera
  const cargarPapelera = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/papelera', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDocumentos(response.data);
      setDocumentosFiltrados(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la papelera');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Búsqueda ahora se hace DENTRO del modal
  const handleBusquedaModal = (valor) => {
    setBusqueda(valor);
    
    if (valor.trim() === '') {
      setDocumentosFiltrados(documentos);
    } else {
      const filtrados = documentos.filter(doc =>
        doc.nombre_documento.toLowerCase().includes(valor.toLowerCase())
      );
      setDocumentosFiltrados(filtrados);
    }
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setDocumentosFiltrados(documentos);
  };

  // Restaurar documento
  const handleRestore = async (idDocumentoDesechado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/papelera/restore/${idDocumentoDesechado}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      cargarPapelera();
    } catch (err) {
      alert('Error al restaurar el documento');
      console.error('Error:', err);
    }
  };

  // Eliminar documento permanentemente
  const handleDelete = async (idDocumentoDesechado) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este documento permanentemente?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/papelera/${idDocumentoDesechado}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      cargarPapelera();
    } catch (err) {
      alert('Error al eliminar el documento');
      console.error('Error:', err);
    }
  };

  return (
    <div className="papelera-page">
      <div className="papelera-header">
        <div className="header-left">
          <BackButton to="/Administrador" />
        </div>
        <div className="header-center">
          <h1>Papelera</h1>
        </div>
        <div className="header-right">
          {/* ✅ SearchBar ahora es un botón que abre el modal */}
          <SearchBar 
            onClick={() => setMostrarModalBusqueda(true)}
            placeholder="Buscar documento..."
          />
        </div>
      </div>

      <div className="papelera-content">
        {loading ? (
          <div className="papelera-loading">
            <p>Cargando papelera...</p>
          </div>
        ) : error ? (
          <div className="papelera-error">
            <p>{error}</p>
          </div>
        ) : (
          <TrashedDocumentsGrid 
            documentos={documentosFiltrados}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ✅ Modal de búsqueda con input interno */}
      <SearchModal 
        isOpen={mostrarModalBusqueda}
        onClose={() => setMostrarModalBusqueda(false)}
        searchTerm={busqueda}
        onSearchChange={handleBusquedaModal}
        onClear={handleLimpiarBusqueda}
        results={documentosFiltrados}
        onDownload={null} // La papelera no tiene descarga, solo restaurar/eliminar
        emptyMessage="Escribe para buscar documentos en la papelera..."
        noResultsMessage="No se encontraron documentos en la papelera con ese nombre"
      />
    </div>
  );
};

export default Papelera;