// Import express
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');

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
  mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
