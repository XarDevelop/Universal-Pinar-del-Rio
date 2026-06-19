import { io } from 'socket.io-client';

// Ajusta esta URL según tu entorno:
// Desarrollo local: 'http://localhost:5000'
// Servidor físico: 'http://192.168.x.x:5000' (IP de tu servidor)
const URL = import.meta.env.VITE_SOCKET_URL || 'http://192.16.89.11:5000';

export const socket = io(URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Eventos de conexión para debug
socket.on('connect', () => {
  console.log('✅ Conectado al servidor Socket.io:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Desconectado del servidor Socket.io');
});

socket.on('connect_error', (error) => {
  console.error('⚠️ Error de conexión Socket.io:', error.message);
});