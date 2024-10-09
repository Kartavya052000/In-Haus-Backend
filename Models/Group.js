const mongoose = require('mongoose');

// Define the Group schema
const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User', // Assuming you have a User model defined
      required: true,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User', // Assuming you have a User model defined
    required: true,
  },
}, {
  timestamps: true, // Optional: This adds createdAt and updatedAt timestamps
});

// Create the Group model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
