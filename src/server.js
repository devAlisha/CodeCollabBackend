import express from "express";
import http from "http";
import { envVariables } from "./config/envVariables.js";
import { roomHandlers } from "./socket/roomSocket/roomHandler.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://code-collab-frontend-nine.vercel.app",
  },
});

export const startServer = async () => {
  console.log("Starting server...");
  try {
    server.listen(envVariables.PORT, () => {
      console.log(`Server is running on port: ${envVariables.PORT}`);
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      roomHandlers(io, socket);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};
