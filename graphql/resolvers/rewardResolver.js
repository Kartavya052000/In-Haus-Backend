const rewardController = require('../../Controllers/rewardController');

const rewardResolver = {
  Query: {
    getPoints: async (_, { userId }) => {
      return await rewardController.getUserPoints(userId);
    },
    getReward: async (_, { rewardId }) => {
      try {
        const reward = await rewardController.getReward(rewardId);
        if (!reward) {
          throw new Error('Reward not found');
        }
        return reward;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getRedeemedRewards: async (_, { userId }) => {
      try {
        return await rewardController.getRedeemedRewards(userId);
      } catch (error) {
        console.error("Error fetching redeemed rewards:", error);
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    // Create reward mutation
    createReward: async (_, args, context) => {
      const user = context.user;

      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to create a reward.");
      }

      try {
        // Pass the required arguments to the controller
        const rewardArgs = {
          name: args.name,
          pointsAssigned: args.pointsAssigned,
          expiryDate: args.expiryDate,
          category: args.category,
          createdBy: user.userId, 
        };

        const createdReward = await rewardController.createReward(rewardArgs);
        return createdReward; 
      } catch (error) {
        console.error('Error creating reward:', error);
        throw new Error('Failed to create reward.');
      }
    },
    redeemReward: async (_, { rewardId, userId }) => {
      return rewardController.redeemReward(rewardId, userId);
    },

    // Edit reward mutation
    editReward: async (_, { rewardId, updatedRewardDetails }, context) => {
      const user = context.user;

      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to edit a reward.");
      }

      try {
        // Pass the reward ID and updated details to the controller
        const editedReward = await rewardController.editReward(rewardId, updatedRewardDetails);

        return editedReward;
      } catch (error) {
        console.error('Error editing reward:', error);
        throw new Error('Failed to edit reward.');
      }
    }
  },
  
};

module.exports = rewardResolver;
