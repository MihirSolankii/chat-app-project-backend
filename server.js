const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Use CORS middleware
app.use(cors({
  origin: "http://localhost:3000", // Adjust this as needed
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
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
