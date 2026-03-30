const jwt = require('jsonwebtoken');

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ AGREGADO: es_admin basado en nombre_usuario
    req.user = {
      id: decoded.id,
      nombre_usuario: decoded.nombre_usuario,
      es_representante: decoded.es_representante,
      id_seccion: decoded.id_seccion,
      es_admin: decoded.nombre_usuario === 'admin'  // ✅ NUEVO
    };

    next();
    
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
  if (!req.user.es_admin) {  // ✅ Usar la propiedad que ahora sí existe
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

// Exportar ambas
module.exports = { verifyToken, isAdmin };