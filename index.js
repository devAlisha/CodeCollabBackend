const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
require('dotenv').config();
const db = require('./db');
const Room = require('./models/room.js');
const cors = require('cors');
const app = express();
app.use(cors());
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

  socket.on('joinRoom', async ({ roomName, username, password }) => {
    try {
      const room = await Room.findOne({ name: roomName });

      if (!room) {
        throw new Error('Room does not exist');
      }

      if (room.password && room.password !== password) {
        throw new Error('Invalid password');
      }

      socket.join(roomName);
      room.participants = room.participants || [];
      room.participants.push({ id: socket.id, username });
      await room.save();

      usersInRooms[roomName] = room.participants;

      socket.emit('roomJoined', { roomName, username });
      io.to(roomName).emit('updateUsers', usersInRooms[roomName]);
    } catch (error) {
      socket.emit('joinRoomError', error.message);
    }
  });

  socket.on('createRoom', async ({ username, password }) => {
    try {
      const roomName = crypto.randomBytes(4).toString('hex');
      socket.join(roomName);

      // Save the room to MongoDB
      await Room.create({
        name: roomName,
        password: password,
        participants: [{ id: socket.id, username }],
      });

      usersInRooms[roomName] = [{ id: socket.id, username }];

      socket.emit('roomCreated', { roomName, username });
      io.to(roomName).emit('updateUsers', usersInRooms[roomName]);
    } catch (error) {
      socket.emit('createRoomError', error.message);
    }
  });

  socket.on('leaveRoom', async ({ roomName, username }) => {
    try {
      const room = await Room.findOne({ name: roomName });

      if (!room) {
        throw new Error('Room does not exist');
      }

      socket.leave(roomName);

      if (room.participants) {
        room.participants = room.participants.filter(user => user.id !== socket.id);
        await room.save();
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

  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.id}`);
    try {
      for (const room in rooms) {
        if (rooms[room].participants) {
          rooms[room].participants = rooms[room].participants.filter(user => user.id !== socket.id);
          usersInRooms[room] = rooms[room].participants;
          io.to(room).emit('updateUsers', usersInRooms[room]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
