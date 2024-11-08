// models/Meal.js
const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  id: Number,
  amount: Number,
  unit: String,
  unitLong: String,
  unitShort: String,
  aisle: String,
  name: String,
  original: String,
  originalName: String,
  meta: [String],
  extendedName: String,
  image: String,
});

const mealSchema = new mongoose.Schema({
  mealStyle: {
    type: String,
    enum: ['main course', 'dessert', 'breakfast', 'side dish', 'salad', 'soup'],
    required: true,
  },
  cuisine: {
    type: String,
    enum: ['chinese', 'indian', 'japanese', 'latin america', 'italian', 'vietnamese', 'general'],
    required: true,
  },
  meals: [
    {
      id: Number,
      title: String,
      usedIngredientCount: Number,
      missedIngredientCount: Number,
      missedIngredients: [ingredientSchema],
      usedIngredients: [ingredientSchema],
      unusedIngredients: [ingredientSchema],
      likes: Number,
      image: String,
      imageType: String,
    },
  ],
});

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
