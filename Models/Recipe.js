const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  id: Number,
  name: String,
  amount: Number,
  unit: String,
  unitLong: String,
  unitShort: String,
});

const StepSchema = new mongoose.Schema({
  number: Number,
  step: String,
});

const RecipeSchema = new mongoose.Schema({
  id: String,
  title: String,
  image: String,
  summary: String,
  readyInMinutes: String,
  healthScore: String,
  cuisines: [String],
  servings: String,
  instructions: String,
  steps: [StepSchema],
  ingredients: [IngredientSchema],
});

module.exports = mongoose.model('Recipe', RecipeSchema);
