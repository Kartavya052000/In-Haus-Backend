const groupController = require('../../Controllers/groupController'); // Adjust the path as necessary

const groupResolver = {
  Mutation: {
    createGroup: async (_, args, context) => {
      const user = context.user; // Get the authenticated user from context

      // Ensure the user is authenticated
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to create a group.");
      }

      // Extract the groupName and members from args
      const { groupName, members } = args;

      // Create the group data object
      const groupData = {
        groupName,
        members: [...members, user.userId], // Include the creator in the members list
        createdBy: user.userId, // Use the authenticated user's ID
      };

      // Call the controller's createGroup method
      return await groupController.createGroup(groupData);
    },
    // Uncomment and implement if needed
    // addMemberToGroup: async (_, { groupId, userId }) => {
    //   // Implement this logic if needed
    // },
    // removeMemberFromGroup: async (_, { groupId, userId }) => {
    //   // Implement this logic if needed
    // },
  },
  Query: {
    hello: () => 'Hello world!',
    
    getGroup: async (_,args,context) => {
      const user = context.user; // Get the authenticated user from context
// console.log(user,"usereeeeeee");
if (!user || !user.userId) {
  throw new Error("Unauthorized! You must be logged in to get a group.");
}
        try {
          // const user 
          const group = await groupController.findGroupById(user.userId,args);
          if (!group) {
            throw new Error('Group not found');
          }
          return group;
        } catch (error) {
          throw new Error(error.message);
        }
      },
      getUserTasksInGroup: async (_, { groupId,userId,startDate }, context) => {
        // Retrieve userId from context
        // Debugging userId
        
        // Find the group by ID
        const group = await groupController.findGroupById(userId);
        if (!group) {
          throw new Error('Group not found');
        }
      
        // Check if the user is a member of the group
        const isMember = group.members.some(member => member.id === userId);
        if (!isMember) {
          throw new Error('User is not a member of this group');
        }
      
        // Fetch tasks assigned to the user in the specified group
        const tasks = await groupController.getUserTasksInGroup(groupId, userId,startDate);
      
        // Find the user object for the given userId from the group members
        const user = group.members.find(member => member.id === userId);
        if (!user) {
          throw new Error('User not found in the group');
        }
      
        // Return only the user details and their tasks
        return {
          id: userId,
          username: user.username, // Get username directly from the user object
          filteredTasks: tasks.filteredTasks.map(task => ({
            id: task.id.toString(),
            taskName: task.taskName,
            startDate: task.startDate,
            endDate: task.endDate,
            points:task.points,
            category: task.category,
            assignedTo: {
              id: task.assignedTo.id.toString(),
              // username: task.assignedTo.username, // Uncomment if needed
            },
          })),
        };
      },
      getMyTasksInGroup:async(_,{},context) => {
        const User = context.user; // Get the authenticated user from context
        console.log(User,"user");
        if (!User || !User.userId) {
          throw new Error("Unauthorized! You must be logged in to get a group.");
        }
        const group = await groupController.findGroupById(User.userId);
        if (!group) {
          throw new Error('Group not found');
        }
         // Check if the user is a member of the group
         const isMember = group.members.some(member => member.id === User.userId);
         if (!isMember) {
           throw new Error('User is not a member of this group');
         }

               
        // Fetch tasks assigned to the user in the specified group
        const tasks = await groupController.getMyUserTasksInGroup(User.userId);
           // Find the user object for the given userId from the group members
           const user = group.members.find(member => member.id === User.userId);
           if (!user) {
             throw new Error('User not found in the group');
           }
         
           // Return only the user details and their tasks
           return {
             id: User.userId,
             username: user.username, // Get username directly from the user object
             filteredTasks: tasks.filteredTasks.map(task => ({
               id: task.id.toString(),
               taskName: task.taskName,
               startDate: task.startDate,
               endDate: task.endDate,
               points:task.points,
               category: task.category,
               assignedTo: {
                 id: task.assignedTo.id.toString(),
                 // username: task.assignedTo.username, // Uncomment if needed
               },
             })),
           };
      }
      
        
  },
};

module.exports = groupResolver;
