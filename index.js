const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 8000;

const rooms = {};
const usersInRooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ roomName, username, password }) => {
    try {
      if (!rooms[roomName]) {
        throw new Error('Room does not exist');
      }

      const room = rooms[roomName];

      if (room.password && room.password !== password) {
        throw new Error('Invalid password');
      }

      socket.join(roomName);
      room.participants = room.participants || [];
      room.participants.push({ id: socket.id, username });

      usersInRooms[roomName] = room.participants;

      socket.emit('roomJoined', { roomName, username });
      io.to(roomName).emit('updateUsers', usersInRooms[roomName]);
    } catch (error) {
      socket.emit('joinRoomError', error.message);
    }
  });

  socket.on('createRoom', ({ username, password }) => {
    try {
      const roomName = crypto.randomBytes(4).toString('hex');
      socket.join(roomName);
      rooms[roomName] = { password, participants: [{ id: socket.id, username }] };

      usersInRooms[roomName] = rooms[roomName].participants;

      socket.emit('roomCreated', { roomName, username });
      io.to(roomName).emit('updateUsers', usersInRooms[roomName]);
    } catch (error) {
      socket.emit('createRoomError', error.message);
    }
  });

  socket.on('leaveRoom', ({ roomName, username }) => {
    try {
      if (!rooms[roomName]) {
        throw new Error('Room does not exist');
      }

      socket.leave(roomName);

      const room = rooms[roomName];
      if (room.participants) {
        room.participants = room.participants.filter(user => user.id !== socket.id);
        usersInRooms[roomName] = room.participants;
      }

      socket.emit('roomLeft', roomName);
      io.to(roomName).emit('updateUsers', usersInRooms[roomName]);
    } catch (error) {
      socket.emit('leaveRoomError', error.message);
    }
  });

  socket.on('update', (data) => {
    socket.to(data.room).emit('update', data.text);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const room in rooms) {
      if (rooms[room].participants) {
        rooms[room].participants = rooms[room].participants.filter(user => user.id !== socket.id);
        usersInRooms[room] = rooms[room].participants;
        io.to(room).emit('updateUsers', usersInRooms[room]);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
