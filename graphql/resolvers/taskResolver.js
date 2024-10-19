const taskController = require('../../Controllers/taskController');


const taskResolver = {
    Mutation: {
      createTask: async (_, args, context) => {
        const user = context.user;
//   console.log(user);
  
        // Ensure the user is authenticated
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to create a task.");
        }
  
        // console.log('Authenticated user:', user); // Log user information
  
        const taskArgs = {
          ...args,
          createdBy: user.userId // Include the ID of the authenticated user
        };
  
        const createdTask = await taskController.createTask(taskArgs);
        return createdTask; // Ensure you return the created task
      },
      editTask: async (_, { taskId, updatedTaskDetails }, context) => {
        const user = context.user;
        // Optionally, check if the user has permission to edit the task
  
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to edit a task.");
        }
  
        // Call the editTask method from taskController
        const updatedTask = await taskController.editTask(taskId, updatedTaskDetails);
        return updatedTask; // Return the updated task
      }
    },
    Query: {
        hello: () => 'Hello world!',
        
            // Fetch tasks for a specific group
         getTask: async (_, { taskId }) => {
          console.log("HITTT")
          try {
            const group = await taskController.getTask(taskId);
            if (!group) {
              throw new Error('Group not found');
            }
            return group;
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
  };
  
module.exports = taskResolver;

