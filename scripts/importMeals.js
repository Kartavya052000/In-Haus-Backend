// scripts/importMeals.js

// Import required modules
const mongoose = require('mongoose');
const Meal = require('../Models/Meal'); // Import the Meal model
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env

// Connect to MongoDB using the URL from .env
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// Import the meals data
const importMeals = async () => {
  try {
    // Read the meals.json file
    const data = fs.readFileSync('scripts/meals.json', 'utf8'); // Update 'path/to' to the correct path of your meals.json file
    const mealsData = JSON.parse(data);

    // Ensure the top-level key is "meals" and it's an array
    if (!mealsData.meals || !Array.isArray(mealsData.meals)) {
      throw new Error('The meals.json file should contain a top-level "meals" array.');
    }

    // Insert each meal into the database
    for (let categoryObj of mealsData.meals) {
      for (let category in categoryObj) {
        for (let mealObj of categoryObj[category]) {
          if (mealObj.general && Array.isArray(mealObj.general)) {
            for (let meal of mealObj.general) {
              const newMeal = new Meal(meal);
              await newMeal.save();
            }
          }
        }
      }
    }

    console.log('Meals data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing meals data:', error);
    process.exit(1);
  }
};

// Execute the import function
importMeals();
