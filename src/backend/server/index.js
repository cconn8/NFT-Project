// Building basic server for testing socket connections


const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io')
const cors = require("cors")

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    //  {  #let the server know what you expect
    cors: {
        origin: "http://localhost:3000"   
    }
})


io.on("connection", (socket) => {
    console.log('User Connected'+socket.id)
    
    //listen for incoming events called "send_message" (this would be the iot client sending to server here)
    socket.on("send_message", (data) => {
        console.log(data)
        socket.broadcast.emit('receive_message', data)
    });
})

server.listen(3001, () => {
    console.log("Server is listening...")
})