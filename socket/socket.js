import { Server } from "socket.io";
import http from "http";

export default (http) => {
  const io = new Server(http, { cors: { origin: "*" } });

  io.on("connection", (client) => {});

  return io;
};
