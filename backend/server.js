const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = createServer(app);

// 🔥 CONFIGURAR SOCKET.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Ajusta según tu entorno: ['http://localhost:5173', 'http://tu-ip-servidor']
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware para que las rutas puedan usar io
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const seccionesRoutes = require('./src/routes/seccionesRoutes');
const papeleraRoutes = require('./src/routes/papeleraRoutes');
const representanteRoutes = require('./src/routes/representanteRoutes');

// Registrar rutas
app.use('/api/login', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/secciones', seccionesRoutes);
app.use('/api/papelera', papeleraRoutes);
app.use('/api/documentos', representanteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Error global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ message: 'Error interno', error: err.message });
});

// 🔥 EVENTOS DE SOCKET.IO
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// 🔥 CAMBIAR app.listen POR httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});