// models/MealPlan.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealPlanSchema = new Schema({
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    mealPlanItems: [
      {
        date: String,
        mealId: String,
        mealTitle: String,
        mealType: String,
        image: String,
        servings: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }, { collection: 'mealplans' });
  

module.exports = mongoose.model('MealPlan', MealPlanSchema);
