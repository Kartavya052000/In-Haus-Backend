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
      });

      const savedReward = await newReward.save();

      // Populate createdBy with user details
      const createdByUser = await User.findById(savedReward.createdBy).select('id username');

      // Format the expiry date
      const formattedExpiryDate = new Date(savedReward.expiryDate).toISOString();

      return {
        ...savedReward._doc,
        id: savedReward._id.toString(),
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

      // Push reward details into redeemedRewards
      user.redeemedRewards.push({
        rewardId: reward._id,                 // Reward ID as ObjectId
        name: reward.name,                    // Reward name
        pointsAssigned: reward.pointsAssigned, // Points assigned to the reward
        category: reward.category,            // Reward category
        redeemedAt: new Date(),               // Current timestamp
      });

      // Save the updated user
      await user.save();

      await Reward.findByIdAndDelete(rewardId);

      return {
        message: "Reward redeemed successfully",
        userId: user._id,
        updatedPoints: user.points,
        redeemedRewards: user.redeemedRewards,
      };
    } catch (error) {
      console.error("Error in redeemReward:", error);
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

      // Return the redeemedRewards array from the user object
      return user.redeemedRewards;
    } catch (error) {
      console.error("Error fetching redeemed rewards:", error);
      throw new Error(error.message);
    }
  },
};

module.exports = rewardController;
