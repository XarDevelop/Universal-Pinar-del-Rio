import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', {
        username: username.trim(),
        password: password.trim()
      });

      const { token, user, isAdmin } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (isAdmin) {
        navigate('/Administrador');
      } else if (user.es_representante) {
        navigate('/Representante');
      } else {
        navigate('/Consulta');
      }

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Credenciales incorrectas');
      } else if (err.request) {
        setError('No se puede conectar con el servidor. Verifique que el backend esté corriendo.');
      } else {
        setError('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Panel izquierdo - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="logo-bubble">
            <img 
              src='/logo_empresa.png'
              alt="Logo" 
              className="company-logo"
            />
          </div>
          <h2 className="branding-title">Consultor de Resoluciones</h2>
          <p className="branding-subtitle">
            Consultor de Resoluciones y Documentos Universales Pinar del Río
          </p>
          <div className="branding-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="login-form-panel">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        
        <div className="card-content">
          <div className="card-header">
            <div className="avatar-ring">
              <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Inicie sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              <span className="btn-text">{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
              <span className="btn-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;