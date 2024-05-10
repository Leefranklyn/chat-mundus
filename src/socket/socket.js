import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: { origin: '*' }
});

export const getReceiversSocketId = (receiverId) => {
    return onlineUsers[receiverId]
};


const onlineUsers = {};


io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) {
        onlineUsers[userId] = socket.id;
    };

    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    socket.on("disconnected", () => {
        console.log("A User Disconnected", socket.id);
        delete onlineUsers[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));

    });

});