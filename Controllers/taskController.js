const Task = require("../Models/Tasks");
const User = require("../Models/User"); // Import User model

const taskController = {
  createTask: async (taskDetails) => {
    console.log(taskDetails);
    try {
      const newTask = new Task({
        taskName: taskDetails.taskName,
        startDate: taskDetails.startDate,
        // endDate: taskDetails.endDate,
        repeat: taskDetails.repeat,
        assignedTo: taskDetails.assignedTo,
        points: taskDetails.points,
        type: taskDetails.type,
        createdBy: taskDetails.createdBy,
      });

      const savedTask = await newTask.save();

      // Populate assignedTo and createdBy with user details
      const assignedUser = await User.findById(savedTask.assignedTo).select('id username');
      const createdByUser = await User.findById(savedTask.createdBy).select('id username');

      // Format the dates
      const formattedStartDate = new Date(savedTask.startDate).toISOString();
      const formattedEndDate = new Date(savedTask.endDate).toISOString();

      return {
        ...savedTask._doc,
        id: savedTask._id.toString(),
        assignedTo: {
          id: assignedUser._id.toString(),
          username: assignedUser.username,
        },
        createdBy: {
          id: createdByUser._id.toString(),
          username: createdByUser.username,
        },
        startDate: formattedStartDate, // Return formatted startDate
        endDate: formattedEndDate, // Return formatted endDate
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Error creating task: ' + error.message);
    }
  },
  getTask: async (taskId) => {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      // Populate assignedTo and createdBy with user details
      const assignedUser = await User.findById(task.assignedTo).select('id username');
      const createdByUser = await User.findById(task.createdBy).select('id username');

      // Format the dates
      const formattedStartDate = new Date(task.startDate).toISOString();
      const formattedEndDate = new Date(task.endDate).toISOString();

      return {
        ...task._doc,
        id: task._id.toString(),
        assignedTo: {
          id: assignedUser._id.toString(),
          username: assignedUser.username,
        },
        createdBy: {
          id: createdByUser._id.toString(),
          username: createdByUser.username,
        },
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    } catch (error) {
      console.error('Error retrieving task:', error);
      throw new Error('Error retrieving task: ' + error.message);
    }
  },
  editTask: async (taskId, updatedTaskDetails) => {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      // Update task fields
      task.taskName = updatedTaskDetails.taskName || task.taskName;
      task.startDate = updatedTaskDetails.startDate || task.startDate;
      task.endDate = updatedTaskDetails.endDate || task.endDate;
      task.repeat = updatedTaskDetails.repeat || task.repeat;
      task.assignedTo = updatedTaskDetails.assignedTo || task.assignedTo;
      task.points = updatedTaskDetails.points || task.points;
      task.type = updatedTaskDetails.type || task.type;

      const updatedTask = await task.save();

      // Populate assignedTo and createdBy with user details
      const assignedUser = await User.findById(updatedTask.assignedTo).select('id username');
      const createdByUser = await User.findById(updatedTask.createdBy).select('id username');

      // Format the dates
      const formattedStartDate = new Date(updatedTask.startDate).toISOString();
      const formattedEndDate = new Date(updatedTask.endDate).toISOString();

      return {
        ...updatedTask._doc,
        id: updatedTask._id.toString(),
        assignedTo: {
          id: assignedUser._id.toString(),
          username: assignedUser.username,
        },
        createdBy: {
          id: createdByUser._id.toString(),
          username: createdByUser.username,
        },
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    } catch (error) {
      console.error('Error editing task:', error);
      throw new Error('Error editing task: ' + error.message);
    }
  },
};


module.exports = taskController;
