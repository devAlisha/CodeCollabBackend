export const leaveRoomHandler = (io, socket, rooms, usersInRooms) => {
  socket.on("leaveRoom", ({ roomName }) => {
    const room = rooms[roomName];
    if (!room) {
      return socket.emit("leaveRoomError", "Room does not exist");
    }

    socket.leave(roomName);
    room.participants = room.participants.filter(
      (user) => user.id !== socket.id
    );
    usersInRooms[roomName] = room.participants;

    socket.emit("roomLeft", roomName);
    io.to(roomName).emit("updateUsers", usersInRooms[roomName]);

    if (room.participants.length === 0) {
      delete rooms[roomName];
      delete usersInRooms[roomName];
    }
  });
};
