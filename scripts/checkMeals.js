// scripts/checkMeals.js

const mongoose = require('mongoose');
const Meal = require('../Models/Meal'); // Import Meal model
require('dotenv').config(); // Load environment variables from .env

// Connect to MongoDB using the URL from .env
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Query the database to count meals
const checkMeals = async () => {
  try {
    const mealCount = await Meal.countDocuments();
    console.log(`Total meals in the database: ${mealCount}`);
    process.exit();
  } catch (error) {
    console.error('Error checking meal data:', error);
    process.exit(1);
  }
};

// Execute the check
checkMeals();
