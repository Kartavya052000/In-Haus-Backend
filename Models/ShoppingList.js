const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  shoppingListItems: [
    {
      mealId: String,
      uniqueKey: String,
      mealTitle: String,
      mealImage: String,
      ingredients: [
        {
          id: String,
          uniqueKey: String,
          name: String,
          amount: Number,
          unit: String,
          checked: Boolean,
        },
      ],
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
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
