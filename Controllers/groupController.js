const Group = require('../Models/Group'); // Adjust the path as necessary
const Task = require('../Models/Tasks');
const User = require('../Models/User'); // Import User model

const groupController = {
    createGroup: async (groupData ) => {
        try {
          // Create the new group instance
          const newGroup = new Group(groupData);
          const savedGroup = await newGroup.save();

          // Populate createdBy and members with user details
          const createdByUser = await User.findById(savedGroup.createdBy).select('id username');
          const memberDetails = await User.find({_id: { $in: savedGroup.members }}).select('id username');
if (!createdByUser) {
    throw new Error(`User with ID ${savedGroup.createdBy} not found.`);
}
          // Store the group ID in each member's "groups" field
          await User.updateMany(
            { _id: { $in: savedGroup.members } },  // Find all members by their IDs
            { $addToSet: { groups: savedGroup._id } }  // Use $addToSet to avoid duplicates
          );

          // Store the group ID in the createdBy user's "groups" field only if they are not already in the members list
          if (!savedGroup.members.includes(savedGroup.createdBy)) {
            await User.findByIdAndUpdate(
              savedGroup.createdBy,
              { $addToSet: { groups: savedGroup._id } }  // Use $addToSet here as well
            );
          }

          return {
            ...savedGroup._doc,
            id: savedGroup._id.toString(),
            createdBy: {
              id: createdByUser._id.toString(),
              username: createdByUser.username,
            },
            members: memberDetails.map(member => ({
              id: member._id.toString(),
              username: member.username,
            })),  
          };
        } catch (error) {
          console.error('Error creating group:', error);
          throw new Error('Failed to create group: ' + error.message);
        }
      },

      findGroupById: async (userId) => {
        try {
      const user = await User.findById(userId);
      console.log(user,"UUUU")
          const group = await Group.findById(user.groups[0]).populate('members', 'id username');
          if (!group) {
            throw new Error('Group not found');
          }
      
          // console.log("Group found:", group);
      
          // Step 2: Extract the createdBy (group admin)
          const groupAdminId = group.createdBy;
      
          // Step 3: Fetch tasks that were created by this group admin
          const tasks = await Task.find({ createdBy: groupAdminId }).populate('assignedTo', 'id username');

          // Step 4: Filter tasks based on the assignedTo group members
          const groupMemberIds = group.members.map(member => member._id.toString());
          const filteredTasks = tasks.filter(task => groupMemberIds.includes(task.assignedTo._id.toString()));
          // console.log(filteredTasks,"Tasks"); // Check if tasks have the expected structure
      
          // Return the group details along with the filtered tasks
          return {
            id: group._id.toString(),
            groupName: group.groupName,
            members: group.members.map(member => ({
              id: member._id.toString(),
              username: member.username,
            })),
            filteredTasks: filteredTasks.map(task => ({
              id: task._id.toString(), // Ensure this is included
              taskName: task.taskName,
              startDate: task.startDate.toISOString(),
              endDate: task.endDate.toISOString(),
              repeat: task.repeat,
              assignedTo: {
                id: task.assignedTo._id.toString(),
                username: task.assignedTo.username,
              },
              points: task.points,
              type: task.type,
            })),
          };
        } catch (error) {
          console.error('Error fetching tasks for group:', error);
          throw new Error('Failed to fetch tasks: ' + error.message);
        }
      },
      getUserTasksInGroup: async (groupId, userId) => {
        // Find the group by ID
        console.log("HITT@");
        
        const group = await Group.findById(groupId);
        if (!group) {
          throw new Error('Group not found');
        }
    console.log(group,userId)
        // Check if the user is a member of the group
        const isMember = group.members.some(member => member.toString() === userId);
        if (!isMember) {
          throw new Error('UserC is not a member of this group');
        }
    
        // Fetch tasks assigned to the user in the specified group
        const tasks = await Task.find({
          assignedTo: userId,
          createdBy: group.createdBy, // Optional: ensure the task was created in the group
        });
    // console.log(tasks,"INNN")
        // Return the user details and their tasks
        return {
          id: userId,
          username: tasks.length > 0 ? tasks[0].assignedTo.username : null, // Get username from tasks
          filteredTasks: tasks.map(task => ({
            id: task._id.toString(),
            taskName: task.taskName,
            startDate: task.startDate.toISOString(),
            endDate: task.endDate.toISOString(),
            assignedTo: {
              id: task.assignedTo._id.toString(),
              username: task.assignedTo.username,
            },
          })),
        };
      },
    }

module.exports = groupController;
