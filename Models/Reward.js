const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pointsAssigned: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this references the User model
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this references the User model
    required: true,
  },
  redeemed: {
    type: Boolean,
    default: false, // Set default to false if it hasn't been redeemed yet
    required: true,
  }
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
