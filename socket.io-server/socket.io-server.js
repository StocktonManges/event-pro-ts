/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const app = express();
const server = app.listen(3001);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST", "DELETE", "PATCH"],
  },
});

// The "new-user" and "send-message" emissions are sent from
// "ChatRoomProvider.tsx"
io.on("connection", (socket) => {
  socket.on("new-user", (room) => {
    socket.join(room);
  });

  socket.on("send-message", (newMessageData) => {
    socket.to(newMessageData.room).emit("receive-message", newMessageData);
  });
});
