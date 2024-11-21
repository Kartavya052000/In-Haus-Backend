// Import express
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const graphqlRouter = require('./Routes/graphql');
const Reward = require('./Models/Reward');


// -----socket connectivity----
const http = require('http');
const { Server } = require('socket.io');
require("dotenv").config();

const {MONGO_URL,PORT} = process.env;

// Create an instance of express
const app = express();
app.use(express.json());
app.use(bodyParser.json());
// Define a route
app.use(
    cors({
      origin: true, // Allows all origins
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // Allows cookies and authentication info to be passed
    })
  );
  const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend domain in production
    methods: ['GET', 'POST'],
  },
});
// Database Connection
  mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

  app.use('/', graphqlRouter);



// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });








// -----------------REST API FOR ALEXA TO CREATE REWARD-----
// Endpoint to create a new reward (this can be called from Alexa or any other service)
// app.post('/create-reward-from-alexa', async (req, res) => {
//   const { text, assignedTo,createdBy } = req.body;
//   try {
//     console.log(text)
//     const reward = new Reward({
//       name:text,
//       pointsAssigned:100,
//       expiryDate:new Date(),
//       category:"Testing",
//       createdBy,
//       assignedTo
//     });

//     await reward.save();

//     // Emit a socket event to update clients
//     // io.emit('rewardCreated', reward);  // Broadcast new reward to all clients

//     res.status(200).json({ message: 'Reward created successfully', reward });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating reward' });
//   }
// });


// ------ with socket----
// Socket.IO Connection Logic
// Handle Socket.IO connections
io.on('connect', (socket) => {
  console.log('User connected:', socket.id);

  // Join specific rooms based on user ID
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Emit updates to specific rooms
  socket.on('sendMessage', ({ message, room }) => {
    io.to(room).emit('receiveMessage', { message, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// REST API for Alexa to create a reward
app.post('/create-reward-from-alexa', async (req, res) => {
  const { text, assignedTo, createdBy } = req.body;
  try {
    const reward = new Reward({
      name: text,
      pointsAssigned: 100,
      expiryDate: new Date(),
      category: 'Testing',
      createdBy,
      assignedTo,
    });

    await reward.save();

    // Emit event to specific users
    io.to(createdBy).emit('rewardCreated', reward);
    io.to(assignedTo).emit('rewardCreated', reward);

    res.status(200).json({ message: 'Reward created successfully', reward });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({ message: 'Error creating reward' });
  }
});



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});