const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining as a viewer
  socket.on('joinViewer', () => {
    socket.join('viewers');
  });

  // Handle starting the stream as a host
  socket.on('startStream', () => {
    console.log('Stream started');
    socket.to('viewers').emit('startStream');
  });

  // Handle stopping the stream as a host
  socket.on('stopStream', () => {
    console.log('Stream stopped');
    socket.to('viewers').emit('stopStream');
  });

  // Handle sending video stream data to viewers
  socket.on('stream', (data) => {
    socket.to('viewers').emit('stream', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
