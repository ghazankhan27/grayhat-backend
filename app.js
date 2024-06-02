const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  io.emit("connected-clients", io.engine.clientsCount);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("connected-clients", io.engine.clientsCount);
  });

  socket.on("message", (value) => {
    socket.broadcast.emit("new-message", value);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
