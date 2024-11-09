const MealPlan = require('../../Models/MealPlan');
const User = require('../../Models/User'); // Ensure User model is imported

const mealPlanResolver = {
  Mutation: {
    saveMealPlan: async (_, { mealPlanItems }, context) => {
      const user = context.user;
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to save Meal Plans.");
      }
      
      const user_initial = await User.findById(user.userId);
      const groupId = user_initial.groups[0]; // Get the first group ID
      
      if (!groupId) {
        throw new Error("No group found for the user.");
      }

      try {
        // Find an existing meal plan by groupId
        let mealPlan = await MealPlan.findOne({ groupId });
        
        if (!mealPlan) {
          // If no meal plan exists, create a new one with groupId
          mealPlan = new MealPlan({ groupId, mealPlanItems });
        } else {
          // If a meal plan exists, update it
          mealPlanItems.forEach(newItem => {
            const existingIndex = mealPlan.mealPlanItems.findIndex(
              item =>
                item.mealId === newItem.mealId &&
                item.date === newItem.date &&
                item.mealType === newItem.mealType
            );
            if (existingIndex !== -1) {
              mealPlan.mealPlanItems[existingIndex] = newItem;
            } else {
              mealPlan.mealPlanItems.push(newItem);
            }
          });
          mealPlan.updatedAt = new Date();
        }
        
        await mealPlan.save();
        return mealPlan;
      } catch (error) {
        throw new Error('Failed to save meal plan');
      }
    },

    deleteMealsFromMealPlan: async (_, { mealIds, dates, mealTypes }, context) => {
      const user = context.user;
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to delete meals from Meal Plans.");
      }

      const user_initial = await User.findById(user.userId);
      const groupId = user_initial.groups[0];

      if (!groupId) {
        throw new Error("No group found for the user.");
      }

      try {
        const mealPlan = await MealPlan.findOne({ groupId });
        if (!mealPlan) {
          throw new Error('Meal plan not found for this group');
        }

        // Filter out items where mealId, date, and mealType all match
        mealPlan.mealPlanItems = mealPlan.mealPlanItems.filter(item =>
          !mealIds.includes(item.mealId) ||
          !dates.includes(item.date) ||
          !mealTypes.includes(item.mealType)
        );

        await mealPlan.save();
        return mealPlan;
      } catch (error) {
        throw new Error('Failed to delete meals from meal plan');
      }
    },

    deleteMealPlan: async (_, __, context) => {
      const user = context.user;
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to delete Meal Plans.");
      }

      const user_initial = await User.findById(user.userId);
      const groupId = user_initial.groups[0];

      if (!groupId) {
        throw new Error("No group found for the user.");
      }

      try {
        const mealPlan = await MealPlan.findOneAndDelete({ groupId });
        if (!mealPlan) {
          throw new Error('Meal plan not found for this group');
        }
        return { message: "Meal plan deleted successfully." };
      } catch (error) {
        throw new Error('Failed to delete meal plan');
      }
    }
  },

  Query: {
    getMealPlanByGroup: async (_, __, context) => {
      const user = context.user;
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to get Meal Plans.");
      }

      const user_initial = await User.findById(user.userId);
      const groupId = user_initial.groups[0];

      if (!groupId) {
        throw new Error("No group found for the user.");
      }

      try {
        const mealPlan = await MealPlan.findOne({ groupId });
        if (!mealPlan) {
          throw new Error('Meal plan not found for this group');
        }
        return mealPlan;
      } catch (error) {
        throw new Error('Failed to retrieve meal plan');
      }
    }
  }
};

module.exports = mealPlanResolver;
