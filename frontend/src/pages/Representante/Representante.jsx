import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../../socket'; // 🔥 IMPORTAR SOCKET
import HeroSection from '../../components/HeroSection/HeroSection';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchModal from '../../components/SearchModal/SearchModal';
import SectionMenu from '../../components/SectionMenu/SectionMenu';
import DocumentsGrid from '../../components/DocumentsGrid/DocumentsGrid';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import PanelRepresentante from '../../components/PanelRepresentante/PanelRepresentante';
import ModalAgregarDocumento from '../../components/ModalAgregarDocumento/ModalAgregarDocumento';
import ModalDesecharDocumento from '../../components/ModalDesecharDocumento/ModalDesecharDocumento';
import './Representante.css';

const Representante = () => {
  const [secciones, setSecciones] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // Estados para modales
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [modalDesecharOpen, setModalDesecharOpen] = useState(false);
  
  // Estados para búsqueda con nuevo patrón
  const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.es_representante) {
      navigate('/Consulta');
      return;
    }
    
    if (!user.id_seccion) {
      setError('Tu cuenta no tiene una sección asignada. Contacta al administrador.');
      setIsReady(true);
      return;
    }
    
    setUserData(user);
    setIsReady(true);
  }, [navigate]);

  useEffect(() => {
    if (!isReady || !userData) return;
    
    const cargarSecciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/secciones', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const todasLasSecciones = Array.isArray(response.data) ? response.data : [];
        setSecciones(todasLasSecciones);
        
        const seccionDelRepresentante = todasLasSecciones.find(
          s => s.id_seccion === userData.id_seccion
        );
        
        if (seccionDelRepresentante) {
          setSeccionActiva(seccionDelRepresentante.id_seccion);
        } else if (todasLasSecciones.length > 0) {
          setSeccionActiva(todasLasSecciones[0].id_seccion);
        }
      } catch (err) {
        console.error('Error cargando secciones:', err);
        setSecciones([]);
      }
    };
    
    cargarSecciones();
  }, [isReady, userData]);

  // 🔥 FUNCIÓN REUTILIZABLE PARA CARGAR DOCUMENTOS
  const cargarDocumentos = async (idSeccion) => {
    if (!idSeccion) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/documentos/seccion/${idSeccion}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const docs = Array.isArray(response.data) ? response.data : [];
      setDocumentos(docs);
      setDocumentosFiltrados(docs);
      setError(null);
    } catch (err) {
      console.error('Error cargando documentos:', err);
      setDocumentos([]);
      setDocumentosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seccionActiva) {
      setDocumentos([]);
      setDocumentosFiltrados([]);
      return;
    }
    
    cargarDocumentos(seccionActiva);
  }, [seccionActiva]);

  // 🔥 SOCKET.IO - ESCUCHAR EVENTOS EN TIEMPO REAL
  useEffect(() => {
    if (!seccionActiva) return;

    // Cuando OTRO usuario crea un documento en MI sección
    socket.on('documento:creado', (nuevoDoc) => {
      console.log('📄 Documento creado por otro usuario:', nuevoDoc);
      
      // Solo actualizar si es de mi sección activa
      if (nuevoDoc.id_seccion === seccionActiva) {
        setDocumentos(prev => {
          // Evitar duplicados
          const existe = prev.some(d => d.id_documento === nuevoDoc.id_documento);
          if (existe) return prev;
          
          const nuevos = [nuevoDoc, ...prev];
          // Actualizar también los filtrados si no hay búsqueda activa
          if (busqueda.trim() === '') {
            setDocumentosFiltrados(nuevos);
          }
          return nuevos;
        });
      }
    });

    // Cuando OTRO usuario elimina un documento de MI sección
    socket.on('documento:eliminado', (data) => {
      console.log('🗑️ Documento eliminado:', data);
      
      if (data.id_seccion === seccionActiva) {
        setDocumentos(prev => {
          const filtrados = prev.filter(d => d.id_documento !== parseInt(data.id_documento));
          if (busqueda.trim() === '') {
            setDocumentosFiltrados(filtrados);
          }
          return filtrados;
        });
      }
    });

    return () => {
      socket.off('documento:creado');
      socket.off('documento:eliminado');
    };
  }, [seccionActiva, busqueda]);

  // Búsqueda ahora se hace DENTRO del modal
  const handleBusquedaModal = (valor) => {
    setBusqueda(valor);
    
    if (valor.trim() === '') {
      setDocumentosFiltrados(documentos);
    } else {
      const filtrados = documentos.filter(doc =>
        doc.nombre_documento?.toLowerCase().includes(valor.toLowerCase())
      );
      setDocumentosFiltrados(filtrados);
    }
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setDocumentosFiltrados(documentos);
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
    } catch (err) {
      console.error('Error descargando documento:', err);
      alert('Error al descargar el documento');
    }
  };

  const handleAgregarDocumento = async (data) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('/api/documentos/upload', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // 🔥 YA NO HACE FALTA RECARGAR MANUALMENTE
      // Socket.io actualizará automáticamente a todos los usuarios
      // Pero recargamos por si acaso el socket falla
      if (seccionActiva === userData.id_seccion) {
        await cargarDocumentos(seccionActiva);
      }
      
      setModalAgregarOpen(false);
    } catch (err) {
      alert('Error al agregar documento: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDesecharDocumento = async (nombreDocumento) => {
    try {
      const token = localStorage.getItem('token');
      
      const documento = documentos.find(doc => doc.nombre_documento === nombreDocumento);
      
      if (!documento) {
        alert('Documento no encontrado');
        return;
      }
      
      await axios.post('/api/documentos/desechar', {
        id_documento: documento.id_documento
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // 🔥 YA NO HACE FALTA RECARGAR MANUALMENTE
      // Socket.io actualizará automáticamente
      if (seccionActiva === userData.id_seccion) {
        await cargarDocumentos(seccionActiva);
      }
      
      setModalDesecharOpen(false);
    } catch (err) {
      alert('Error al desechar documento: ' + (err.response?.data?.error || err.message));
    }
  };

  const esSuSeccion = seccionActiva === userData?.id_seccion;

  if (!isReady) {
    return <div className="loading">Cargando...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socket.disconnect(); // 🔥 DESCONECTAR SOCKET AL CERRAR SESIÓN
    navigate('/');
  };

  if (error && !userData) {
    return (
      <div className="representante-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="representante-page">
      <HeroSection />
      
      <div className="representante-header">
        <LogoutButton onLogout={handleLogout}/>
      </div>

      {esSuSeccion && (
        <PanelRepresentante 
          onAgregar={() => setModalAgregarOpen(true)}
          onDesechar={() => setModalDesecharOpen(true)}
        />
      )}

      {!esSuSeccion && (
        <div className="modo-lectura-banner">
          <p>Estás viendo documentos de otra sección. Solo puedes agregar/desechar documentos de tu sección asignada.</p>
        </div>
      )}

      <SearchBar 
        onClick={() => setMostrarModalBusqueda(true)}
        placeholder="Buscar documento..."
      />

      <div className="representante-content">
        <SectionMenu 
          sections={secciones}
          activeSection={seccionActiva}
          onSectionClick={setSeccionActiva}
          showLogout={false}
        />
        
        {loading ? (
          <div className="loading">Cargando documentos...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <DocumentsGrid 
            documents={documentosFiltrados} 
            onDownload={handleDescargar}
          />
        )}
      </div>

      <SearchModal 
        isOpen={mostrarModalBusqueda}
        onClose={() => setMostrarModalBusqueda(false)}
        searchTerm={busqueda}
        onSearchChange={handleBusquedaModal}
        onClear={handleLimpiarBusqueda}
        results={documentosFiltrados}
        onDownload={handleDescargar}
      />

      <ModalAgregarDocumento 
        isOpen={modalAgregarOpen && esSuSeccion}
        onClose={() => setModalAgregarOpen(false)}
        onSubmit={handleAgregarDocumento}
        seccionNombre={secciones.find(s => s.id_seccion === seccionActiva)?.nombre_seccion || ''}
      />

      <ModalDesecharDocumento 
        isOpen={modalDesecharOpen && esSuSeccion}
        onClose={() => setModalDesecharOpen(false)}
        onSubmit={handleDesecharDocumento}
      />
    </div>
  );
};

export default Representante;