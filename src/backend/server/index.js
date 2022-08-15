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
    var fileCount = 1
    console.log('User Connected '+ socket.id)

    //RPI event
    //the client emits a "client_connected" custom event when it connects successfully
    //when this is received, console.log the message on the server
    socket.on("client_connected", (data) => {
        console.log('Client message: ', data.message)
    });

    //RPI event
    //listen for incoming events called "send_message" (this would be the iot client sending to server here)
    socket.on("send_data", (data) => {
        console.log('Received data is: ', data.message)
        //respond to the client with a data_received message!
        socket.emit('data_received', {'message':'The server received your data!'})
        //emit a broadcast event for the frontend to render the new file
        socket.broadcast.emit('file_received', data)
    });

    //FRONTEND APP.js event
    socket.on("connect_event", (data) => {
       socket.emit('received_event', {'message': "Hi App.js - you are connected"}) 
    });
})

server.listen(3001, () => {
    console.log("Server is listening...")
})