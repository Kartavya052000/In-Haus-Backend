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
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  redeemed: {
    type: Boolean,
    default: false,
    required: true,
  },
  redeemedOn: {
    type: Date,
    default: null, // Set to null initially
  }
});

// Middleware to update `redeemedOn` when `redeemed` is set to true
rewardSchema.pre('save', function (next) {
  if (this.redeemed && !this.redeemedOn) {
    this.redeemedOn = new Date();
  }
  next();
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
