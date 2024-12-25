export const joinRoomHandler = (io, socket, rooms, usersInRooms) => {
  socket.on("joinRoom", ({ roomName, username, password }) => {
    if (!rooms[roomName]) {
      return socket.emit("joinRoomError", "Room does not exist");
    }

    const room = rooms[roomName];
    if (room.password && room.password !== password) {
      return socket.emit("joinRoomError", "Invalid password");
    }

    const user = { id: socket.id, username };
    socket.join(roomName);
    room.participants.push(user);
    usersInRooms[roomName] = room.participants;

    socket.emit("roomJoined", { roomName, username });
    io.to(roomName).emit("updateUsers", usersInRooms[roomName]);
  });
};
