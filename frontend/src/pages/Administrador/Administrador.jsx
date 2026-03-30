import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroSection from '../../components/HeroSection/HeroSection';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchModal from '../../components/SearchModal/SearchModal';
import SectionMenu from '../../components/SectionMenu/SectionMenu';
import DocumentsGrid from '../../components/DocumentsGrid/DocumentsGrid';
import PanelAdministracion from '../../components/PanelAdministracion/PanelAdministracion';

export default function Administrador() {
  const navigate = useNavigate();
  
  // Estados
  const [secciones, setSecciones] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !userData) {
      navigate('/');
      return;
    }

    cargarSecciones();
  }, [navigate]);

  // Cargar secciones desde el backend
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

  // Cargar documentos de una sección
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

  // Cambiar de sección
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
      const filtrados = documentos.filter(doc => 
        doc.nombre_documento.toLowerCase().includes(valor.toLowerCase())
      );
      setDocumentosFiltrados(filtrados);
    }
  };

  // Limpiar búsqueda
  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setDocumentosFiltrados([]);
  };

  // Descargar documento
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

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Obtener nombre de sección activa
  const nombreSeccionActiva = secciones.find(s => s.id_seccion === seccionActiva)?.nombre_seccion || 'Documentos';

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div>
      <HeroSection />
      <PanelAdministracion />
      
      {/* ✅ SearchBar ahora es un botón que abre el modal */}
      <SearchBar
        onClick={() => setMostrarModal(true)}
        placeholder="Buscar documento..."
      />

      {/* ✅ Modal con input interno y props actualizadas */}
      <SearchModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        searchTerm={busqueda}
        onSearchChange={handleBusquedaModal}
        onClear={handleLimpiarBusqueda}
        results={documentosFiltrados}
        onDownload={handleDescargar}
      />

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Menú lateral */}
        <SectionMenu
          sections={secciones}
          activeSection={seccionActiva}
          onSectionClick={handleSeccionClick}
          onLogout={handleLogout}
        />

        {/* Grilla de documentos */}
        <DocumentsGrid
          documents={documentos}
          sectionName={nombreSeccionActiva}
          onDownload={handleDescargar}
        />
      </div>

      {/* Mensaje de error global */}
      {error && (
        <div className="error-toast" onClick={() => setError('')}>
          {error}
        </div>
      )}
    </div>
  );
}