const io = require('socket.io-client');
process.env.DEBUG = 'socket.io-client,socket.io:*'; // Enable debug logs
const socket = io('http://127.0.0.1:8080', {
  transports: ['websocket'], // Allow both transports
  reconnectionAttempts: 5 // Limit reconnection attempts
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
  socket.emit('clientMessage', 'Hello from the client!');
});

socket.on('message', (msg) => {
  console.log('Server message:', msg);
});

socket.on('onDemandMessage', (msg) => {
  console.log('On-demand message from server:', msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});