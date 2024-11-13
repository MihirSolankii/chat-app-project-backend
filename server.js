const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['https://chat-app-project-p7oa.onrender.com', 'https://chat-app-project-p7oa.onrender.com/'],  // Accept both versions
    methods: ['GET', 'POST'],
  }
});

// Use CORS middleware
app.use(cors({
  origin: ['https://chat-app-project-p7oa.onrender.com', 'https://chat-app-project-p7oa.onrender.com/'],  // Accept both versions
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Socket.IO setup
io.on("connection", socket => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach(recipientId => {
      const newRecipients = recipients.filter(r => r !== recipientId);
      newRecipients.push(id);
      socket.broadcast.to(recipientId).emit("receive-message", { recipients: newRecipients, text, sender: id });
    });
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
