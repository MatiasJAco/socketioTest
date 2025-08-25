const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; restrict in production
    methods: ["GET", "POST"]
  }
});

// Serve a simple endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// New endpoint to trigger a message to all clients
app.get('/send-message', (req, res) => {
  const message = req.query.message || 'Default message from server';
  io.emit('onDemandMessage', message); // Broadcast to all connected clients
  res.send(`Message sent to all clients: ${message}`);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Emit a welcome message to the connected client
  socket.emit('message', 'Welcome to the Socket.IO server!');

  // Handle incoming messages from clients
  socket.on('clientMessage', (msg) => {
    console.log('Message from client:', msg);
    io.emit('message', `Server received: ${msg}`);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Use OpenShift's environment variables for port
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
const host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});