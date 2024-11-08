const Recipe = require('../../Models/Recipe');

const recipeResolver = {
  Query: {
    async getRecipeById(_, { id }, context) {
        // Ensure the user is authenticated
        const user = context.user;
    
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to get recipes.");
        }

        console.log("Querying for recipe with ID:", id);
        const recipe = await Recipe.findOne({ id: id.toString() });
        console.log("Found recipe:", recipe);
        return recipe;
        
    },
    async getRecipeByName(_, { title }, context) {
        const user = context.user;
    
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to get recipes.");
        }
      const titleRegex = new RegExp(title, 'i'); // Case-insensitive search
      return await Recipe.find({ title: titleRegex });
    }
  },

  Mutation: {
    async addRecipe(_, { recipe }, context) {
        const user = context.user;
    
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to add recipes.");
        }
      const newRecipe = new Recipe(recipe);
      return await newRecipe.save();
    },
    async updateRecipe(_, { id, recipe }, context) {
        const user = context.user;
    
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to update recipes.");
        }
      return await Recipe.findOneAndUpdate({ id }, recipe, { new: true });
    },
    async deleteRecipe(_, { id }, context) {
        const user = context.user;
    
        if (!user || !user.userId) {
          throw new Error("Unauthorized! You must be logged in to delete recipes.");
        }
      const result = await Recipe.findOneAndDelete({ id });
      if (result) return "Recipe deleted successfully.";
      else throw new Error("Recipe not found.");
    }
  }
};

module.exports = recipeResolver;
