const { verifyToken } = require('../Middlewares/authMiddleware');
const MealPlan = require('../Models/MealPlan');

const mealPlanResolver = {
  Mutation: {
    saveMealPlan: async (_, { groupId, mealPlanItems }, context) => {
      const user = await verifyToken(context);
      if (!user) {
        throw new Error('Unauthorized');
      }

      try {
        console.log("GroupId Received:", groupId);
        console.log("MealPlanItems Received:", mealPlanItems);

        const existingMealPlan = await MealPlan.findOne({ groupId });

        if (existingMealPlan) {
          existingMealPlan.mealPlanItems = mealPlanItems;
          await existingMealPlan.save();
          console.log("Meal Plan Updated in DB:", existingMealPlan);
        } else {
          const newMealPlan = new MealPlan({ groupId, mealPlanItems });
          await newMealPlan.save();
          console.log("New Meal Plan Saved in DB:", newMealPlan);
        }

        return await MealPlan.findOne({ groupId });
      } catch (err) {
        console.error("Error saving meal plan:", err);
        throw new Error('Failed to save meal plan');
      }
    },
  },
  Query: {
    getMealPlanByGroup: async (_, { groupId }, context) => {
      const user = await verifyToken(context);
      if (!user) {
        throw new Error('Unauthorized');
      }

      try {
        console.log("Fetching MealPlan for GroupId:", groupId);
        const mealPlan = await MealPlan.findOne({ groupId });
        if (!mealPlan) {
          console.log("No MealPlan found for GroupId:", groupId);
          return null;
        }

        console.log("MealPlan Found:", mealPlan);
        return mealPlan;
      } catch (err) {
        console.error("Error fetching meal plan:", err);
        throw new Error('Failed to fetch meal plan');
      }
    },
  }
};

module.exports = mealPlanResolver;
