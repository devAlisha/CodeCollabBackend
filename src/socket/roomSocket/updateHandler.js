export const updateHandler = (io, socket, rooms) => {
  socket.on("update", ({ room, text }) => {
    if (!rooms[room]) {
      return socket.emit("updateError", "Room does not exist");
    }
    socket.to(room).emit("update", text);
  });
};
