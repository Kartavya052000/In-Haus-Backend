const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  repeat: {
    type: String,
  },
  description:{
    type:String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this references the User model
    required: true,
  },
  points: {
    type: Number,
  },
  type: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure this references the User model
    required: true,
  },
  taskStatus: {
    type: String,
    enum: ['in_progress', 'completed'], // Restrict taskStatus to these values
    default: 'in_progress', // Set default to 'in_progress'
  },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
