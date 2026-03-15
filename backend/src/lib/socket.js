import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all incoming socket connections
io.use(socketAuthMiddleware);

// this is for storing online users
const userSocketMap = {}; //userId:socket.id

io.on("connection", (socket) => {
  console.log(
    `New socket connection: ${socket.id} for user ${socket.user.username}`,
  );

  const userId = socket.userId;
  userSocketMap[userId] = socket.id; // Map userId to socket.id
  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast updated online users list

  socket.on("disconnect", () => {
    console.log(
      `Socket disconnected: ${socket.id} for user ${socket.user.username}`,
    );
    delete userSocketMap[userId]; // Remove user from online users map
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast updated online users list
  });
});

export { io, app, server };
