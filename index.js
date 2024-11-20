// Import express
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const graphqlRouter = require('./Routes/graphql');
const Reward = require('./Models/Reward');
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

// Database Connection
  mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

  app.use('/', graphqlRouter);



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});








// -----------------REST API FOR ALEXA TO CREATE REWARD-----
// Endpoint to create a new reward (this can be called from Alexa or any other service)
app.post('/create-reward-from-alexa', async (req, res) => {
  const { text, assignedTo,createdBy } = req.body;
  try {
    console.log(text)
    const reward = new Reward({
      name:text,
      pointsAssigned:100,
      expiryDate:new Date(),
      category:"Testing",
      createdBy,
      assignedTo
    });
    // const newReward = new Reward({
    //   name: rewardDetails.name,
    //   pointsAssigned: rewardDetails.pointsAssigned,
    //   expiryDate: rewardDetails.expiryDate,
    //   category: rewardDetails.category,
    //   createdBy: rewardDetails.createdBy,
    //   assignedTo:rewardDetails.assignedTo
    // });
    // Save to MongoDB
    await reward.save();

    // Emit a socket event to update clients
    // io.emit('rewardCreated', reward);  // Broadcast new reward to all clients

    res.status(200).json({ message: 'Reward created successfully', reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating reward' });
  }
});