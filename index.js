// Import express
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const graphqlRouter = require('./Routes/graphql');
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
