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
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img 
            src="src/assets/logo_empresa.png" 
            alt="Logo Empresa" 
            className="company-logo"
          />
        </div>

        <h1 className="app-title">Consultor de Resoluciones y Procedimientos</h1>
        
        <p className="company-name">
          Empresa Comercial de Servicios y Productos Universales Pinar del Río
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;