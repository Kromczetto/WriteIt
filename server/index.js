const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', require('./routers/authRoutes'));
app.use('/api', require('./routers/workRoutes'));
app.use('/api', require('./routers/rentalRoutes'));
app.use('/review', require('./routers/reviewRoutes'));
app.use('/pdf', require('./routers/pdfRoutes'));

app.use('/api/friends', require('./routers/friends'));
app.use('/api/chat', require('./routers/chat'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('join', room => {
    socket.join(room);
  });

  socket.on('send-message', msg => {
    io.to(msg.room).emit('new-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
