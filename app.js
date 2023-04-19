const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} =require("socket.io");
const io = new Server(server);
const tf = require('@tensorflow/tfjs-node');
const messages = []

// Load your machine learning model
const model = await tf.loadLayersModel('exam_app.pkl');

// Listen for incoming client connections
io.on('connection', (socket) => {
    const username = socket.handshake.query.username
    // Listen for incoming data from the client
    socket.on('message', (data) => {
        const message = {
            message: data.message,
            senderusername: username,
            sentAt: Date.now()
        }
        messages.push(message)
        io.emit('message', message)
    })
    // Process the data using your machine learning model
    const result = model.predict(data);
    // Emit the result back to the client
    socket.emit('result', result);
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});
