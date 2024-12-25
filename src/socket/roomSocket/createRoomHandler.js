import crypto from 'crypto'
export const createRoomHandler = (io, socket, rooms, usersInRooms) => {
  socket.on("createRoom", ({ username, password }) => {
    const roomName = crypto.randomBytes(4).toString("hex");

    const newRoom = {
      name: roomName,
      password: password || null,
      participants: [{ id: socket.id, username }],
    };

    rooms[roomName] = newRoom;
    usersInRooms[roomName] = newRoom.participants;

    socket.join(roomName);

    socket.emit("roomCreated", { roomName, username });
    io.to(roomName).emit("updateUsers", usersInRooms[roomName]);
  });
};
