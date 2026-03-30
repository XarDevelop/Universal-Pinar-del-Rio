import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Consulta.css';

import HeroSection from '../../components/HeroSection/HeroSection';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchModal from '../../components/SearchModal/SearchModal';
import SectionMenu from '../../components/SectionMenu/SectionMenu';
import DocumentsGrid from '../../components/DocumentsGrid/DocumentsGrid';

const Consulta = () => {
  const navigate = useNavigate();
  
  const [secciones, setSecciones] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !userData) {
      navigate('/');
      return;
    }
    cargarSecciones();
  }, [navigate]);

  const cargarSecciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/secciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSecciones(response.data);
      
      if (response.data.length > 0) {
        setSeccionActiva(response.data[0].id_seccion);
        cargarDocumentos(response.data[0].id_seccion);
      }
    } catch (error) {
      console.error('Error cargando secciones:', error);
      setError('Error al cargar las secciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarDocumentos = async (idSeccion) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/documentos/seccion/${idSeccion}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setDocumentos(response.data);
    } catch (error) {
      console.error('Error cargando documentos:', error);
      setDocumentos([]);
    }
  };

  const handleSeccionClick = (idSeccion) => {
    setSeccionActiva(idSeccion);
    cargarDocumentos(idSeccion);
    setBusqueda('');
    setDocumentosFiltrados([]);
  };

  // ✅ Búsqueda ahora se hace DENTRO del modal
  const handleBusquedaModal = (valor) => {
    setBusqueda(valor);
    
    if (valor.trim() === '') {
      setDocumentosFiltrados([]);
    } else {
      // Buscar en TODOS los documentos de todas las secciones
      const filtrados = documentos.filter(doc => 
        doc.nombre_documento.toLowerCase().includes(valor.toLowerCase())
      );
      setDocumentosFiltrados(filtrados);
    }
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setDocumentosFiltrados([]);
  };

  const handleDescargar = async (idDocumento, nombreDocumento) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/documentos/${idDocumento}/descargar`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreDocumento);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando documento:', error);
      setError('Error al descargar el documento');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const nombreSeccionActiva = secciones.find(s => s.id_seccion === seccionActiva)?.nombre_seccion || 'Documentos';

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="consulta-page">
      <HeroSection />

      {/* ✅ SearchBar ahora es un botón que abre el modal */}
      <SearchBar
        onClick={() => setMostrarModal(true)}
        placeholder="Buscar documento..."
      />

      {/* ✅ El modal maneja su propia búsqueda */}
      <SearchModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        searchTerm={busqueda}
        onSearchChange={handleBusquedaModal}
        onClear={handleLimpiarBusqueda}
        results={documentosFiltrados}
        onDownload={handleDescargar}
      />

      <div className="main-container">
        <SectionMenu
          sections={secciones}
          activeSection={seccionActiva}
          onSectionClick={handleSeccionClick}
          onLogout={handleLogout}
        />

        <DocumentsGrid
          documents={documentos}
          sectionName={nombreSeccionActiva}
          onDownload={handleDescargar}
        />
      </div>

      {error && (
        <div className="error-toast" onClick={() => setError('')}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Consulta;