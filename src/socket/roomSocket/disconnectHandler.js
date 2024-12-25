import { cleanupDisconnectedUser } from "../../utils/cleanupDisconnectHandler.js";

export const disconnectHandler = (io, socket, rooms, usersInRooms) => {
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    cleanupDisconnectedUser(io, socket, rooms, usersInRooms);
  });
};
