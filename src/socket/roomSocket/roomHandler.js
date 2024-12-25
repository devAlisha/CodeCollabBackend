import { leaveRoomHandler } from "./leaveRoomHandler.js";
import { createRoomHandler } from "./createRoomHandler.js";
import { joinRoomHandler } from "./joinRoomHandler.js";
import { disconnectHandler } from "./disconnectHandler.js";
import { updateHandler } from "./updateHandler.js";

const rooms = {}; 
const usersInRooms = {}; 

export const roomHandlers = (io, socket) => {
  joinRoomHandler(io, socket, rooms, usersInRooms);
  createRoomHandler(io, socket, rooms, usersInRooms);
  leaveRoomHandler(io, socket, rooms, usersInRooms);
  updateHandler(io, socket, rooms);
  disconnectHandler(io, socket, rooms, usersInRooms);
};