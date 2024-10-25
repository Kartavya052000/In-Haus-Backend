const Reward = require("../Models/Reward");
const User = require("../Models/User"); // Import User model

const rewardController = {
  // Create a reward
  createReward: async (rewardDetails) => {
    console.log(rewardDetails);
    try {
      const newReward = new Reward({
        name: rewardDetails.name,
        pointsAssigned: rewardDetails.pointsAssigned,
        expiryDate: rewardDetails.expiryDate,
        category: rewardDetails.category,
        createdBy: rewardDetails.createdBy,
        assignedTo:rewardDetails.assignedTo
      });

      const savedReward = await newReward.save();

      // Populate createdBy with user details
      const assignedUser = await User.findById(rewardDetails.assignedTo).select('id username');
      const createdByUser = await User.findById(savedReward.createdBy).select('id username');
console.log(assignedUser,"assigned")
      // Format the expiry date
      const formattedExpiryDate = new Date(savedReward.expiryDate).toISOString();

      return {
        ...savedReward._doc,
        id: savedReward._id.toString(),
        assignedTo: {
          id: assignedUser._id.toString(),
          username: assignedUser.username,
        },
        createdBy: {
          id: createdByUser._id.toString(),
          username: createdByUser.username,
        },
        expiryDate: formattedExpiryDate, // Return formatted expiryDate
      };
    } catch (error) {
      console.error('Error creating reward:', error);
      throw new Error('Error creating reward: ' + error.message);
    }
  },

  // Get a reward by ID
  getReward: async (rewardId) => {
    try {
      const reward = await Reward.findById(rewardId);
      if (!reward) {
        throw new Error("Reward not found");
      }

      // Populate createdBy with user details
      const createdByUser = await User.findById(reward.createdBy).select('id username');

      // Format the expiry date
      const formattedExpiryDate = new Date(reward.expiryDate).toISOString();

      return {
        ...reward._doc,
        id: reward._id.toString(),
        createdBy: {
          id: createdByUser._id.toString(),
          username: createdByUser.username,
        },
        expiryDate: formattedExpiryDate, 
      };
    } catch (error) {
      console.error('Error retrieving reward:', error);
      throw new Error('Error retrieving reward: ' + error.message);
    }
  },

  // Edit a reward by ID
  editReward: async (rewardId, updatedRewardDetails) => {
    try {
      const reward = await Reward.findById(rewardId);
      if (!reward) {
        throw new Error("Reward not found");
      }

      // Update reward fields
      reward.name = updatedRewardDetails.name || reward.name;
      reward.pointsAssigned = updatedRewardDetails.pointsAssigned || reward.pointsAssigned;
      reward.expiryDate = updatedRewardDetails.expiryDate || reward.expiryDate;
      reward.category = updatedRewardDetails.category || reward.category;

      const updatedReward = await reward.save();

      // Populate createdBy with user details
      const createdByUser = await User.findById(updatedReward.createdBy).select('id username');

      // Format the expiry date
      const formattedExpiryDate = new Date(updatedReward.expiryDate).toISOString();

      return {
        ...updatedReward._doc,
        id: updatedReward._id.toString(),
        createdBy: {
          id: createdByUser._id.toString(),
          username: createdByUser.username,
        },
        expiryDate: formattedExpiryDate, 
      };
    } catch (error) {
      console.error('Error editing reward:', error);
      throw new Error('Error editing reward: ' + error.message);
    }
  },

  // Fetch user points by userId
  getUserPoints: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return {
        userId: user._id,
        points: user.points, 
      };
    } catch (error) {
      console.error('Error fetching user points:', error);
      throw new Error('Error fetching user points: ' + error.message);
    }
  },

  // Redeem Reward
  redeemReward: async (rewardId, userId) => {
    try {
      // Find the reward by its ID
      const reward = await Reward.findById(rewardId);
      if (!reward) {
        throw new Error("Reward not found");
      }

      // Find the user by their ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if the user has enough points to redeem the reward
      if (user.points < reward.pointsAssigned) {
        throw new Error("Insufficient points to redeem this reward");
      }

      // Deduct points and add the reward details into the user's redeemedRewards
      user.points -= reward.pointsAssigned;
   
// redeem status
reward.redeemed = true
      // Save the updated user
      await user.save();
      await reward.save()

      // not this
      // await Reward.findByIdAndDelete(rewardId);
console.log(reward);
return reward
      // return {
      //   message: "Reward redeemed successfully",
      //   userId: user._id,
      //   updatedPoints: user.points,
      //   redeemedRewards: user.redeemedRewards,
      // };
    } catch (error) {
      console.error("Error in redeemReward:", error);
      throw new Error(error.message);
    }
  },
// Get User rewards by id 
// Get All Redeemed Rewards
rewardsList: async (userId) => {
  try {
    // Fetch the user's points
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Find rewards assigned to the userId where redeemed is false and pointsAssigned is less than the user's points
    const rewards = await Reward.find({
      assignedTo: userId,
      redeemed: false,
      pointsAssigned: { $lte: user.points } // Compare reward points with user's points
    });

    if (!rewards || rewards.length === 0) {
      return []
      // throw new Error("No eligible rewards found");
    }
console.log(rewards,"Controller")
    return rewards; // Return the filtered list of rewards
  } catch (error) {
    console.error("Error fetching rewards:", error);
    throw new Error(error.message);
  }
},

  // Get All Redeemed Rewards
  getRedeemedRewards: async (userId) => {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const rewards = await Reward.find({
        assignedTo: userId,
        redeemed: true,
      });
  
      if (!rewards || rewards.length === 0) {
        return []; // Return an empty array if no eligible rewards found
      }
      return  rewards;
      // Return the redeemedRewards array from the user object
      // return user.redeemedRewards;
    } catch (error) {
      console.error("Error fetching redeemed rewards:", error);
      throw new Error(error.message);
    }
  },
};

module.exports = rewardController;
