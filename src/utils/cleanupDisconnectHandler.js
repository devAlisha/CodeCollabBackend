export const cleanupDisconnectedUser = (io, socket, rooms, usersInRooms) => {
  Object.keys(rooms).forEach((roomName) => {
    const room = rooms[roomName];
    room.participants = room.participants.filter(
      (user) => user.id !== socket.id
    );
    usersInRooms[roomName] = room.participants;

    io.to(roomName).emit("updateUsers", usersInRooms[roomName]);

    if (room.participants.length === 0) {
      delete rooms[roomName];
      delete usersInRooms[roomName];
    }
  });
};
