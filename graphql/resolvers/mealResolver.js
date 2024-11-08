const Meal = require('../../Models/Meal');

const mealResolver = {
  Query: {
    async getMeals(_, { mealStyle, cuisine, title, ingredients }, context) {
      const user = context.user;
    
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to get Meals.");
      }

      try {
        let mealDocuments;

        // Case 1: Title-only search across all cuisines and meal styles
        if (title && !mealStyle && !cuisine && (!ingredients || ingredients.length === 0)) {
          const titleRegex = new RegExp(title, 'i'); // Case-insensitive partial match
          mealDocuments = await Meal.find({
            meals: { $elemMatch: { title: titleRegex } }
          });

          mealDocuments = mealDocuments.map(doc => ({
            ...doc._doc,
            meals: doc.meals.filter(meal => titleRegex.test(meal.title)),
          })).filter(doc => doc.meals.length > 0);

        // Case 2: Title and Cuisine provided, ignore mealStyle
        } else if (title && cuisine && !mealStyle) {
          const titleRegex = new RegExp(title, 'i');
          mealDocuments = await Meal.find({
            cuisine,
            meals: { $elemMatch: { title: titleRegex } }
          });

          mealDocuments = mealDocuments.map(doc => ({
            ...doc._doc,
            meals: doc.meals.filter(meal => titleRegex.test(meal.title)),
          })).filter(doc => doc.meals.length > 0);

        // Case 3: Cuisine and Ingredients only, ignore mealStyle and title
        } else if (cuisine && ingredients && ingredients.length > 0 && !mealStyle && !title) {
          const ingredientRegexes = ingredients.map(ing => new RegExp(ing, 'i'));
          mealDocuments = await Meal.find({
            cuisine,
            meals: { $elemMatch: { "missedIngredients.name": { $exists: true } } }
          });

          // Filter meals to ensure all specified ingredients match
          mealDocuments = mealDocuments.map(doc => ({
            ...doc._doc,
            meals: doc.meals.filter(meal =>
              ingredientRegexes.every(regex =>
                meal.missedIngredients.some(ingredient => regex.test(ingredient.name))
              )
            ),
          })).filter(doc => doc.meals.length > 0);

        // Standard Case: Filter by mealStyle and cuisine, fallback to general cuisine if no matches
        } else {
          const filter = {};
          if (mealStyle) filter.mealStyle = mealStyle;
          if (cuisine) filter.cuisine = cuisine;
          
          mealDocuments = await Meal.find(filter);

          // Fallback to general cuisine if no matches found
          if ((!mealDocuments || mealDocuments.length === 0) && cuisine !== "general") {
            filter.cuisine = "general";
            mealDocuments = await Meal.find(filter);
          }

          // Apply title filtering if provided
          if (title) {
            const titleRegex = new RegExp(title, 'i');
            mealDocuments = mealDocuments.map(doc => ({
              ...doc._doc,
              meals: doc.meals.filter(meal => titleRegex.test(meal.title)),
            })).filter(doc => doc.meals.length > 0);
          }

          // Apply ingredient filtering if provided
          if (ingredients && ingredients.length > 0) {
            const ingredientRegexes = ingredients.map(ing => new RegExp(ing, 'i'));
            mealDocuments = mealDocuments.map(doc => ({
              ...doc._doc,
              meals: doc.meals.filter(meal =>
                ingredientRegexes.every(regex =>
                  meal.missedIngredients.some(ingredient => regex.test(ingredient.name))
                )
              ),
            })).filter(doc => doc.meals.length > 0);
          }
        }

        // Return empty result if no matching documents
        if (!mealDocuments || mealDocuments.length === 0) {
          return {
            mealStyle: mealStyle || null,
            cuisine: cuisine || null,
            meals: [],
            offset: 0,
            number: 0,
            totalResults: 0,
          };
        }

        // Flatten the meals from all matching documents
        const meals = mealDocuments.flatMap(doc => doc.meals);

        // Construct the response with valid data
        return {
          mealStyle: mealStyle || (mealDocuments[0] ? mealDocuments[0].mealStyle : null),
          cuisine: cuisine || (mealDocuments[0] ? mealDocuments[0].cuisine : null),
          meals: meals,
          offset: mealDocuments[0].offset,
          number: mealDocuments[0].number,
          totalResults: meals.length,
        };
      } catch (error) {
        console.error('Error fetching meal data: ', error);
        throw new Error('Failed to fetch meal data.');
      }
    },
  },

  Mutation: {
    async addMeal(_, { mealStyle, cuisine, meal }, context) {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      try {
        let mealDocument = await Meal.findOne({ mealStyle, cuisine });

        if (!mealDocument) {
          mealDocument = new Meal({
            mealStyle,
            cuisine,
            meals: [meal],
            offset: 0,
            number: 100,
            totalResults: 1,
          });
        } else {
          mealDocument.meals.push(meal);
          mealDocument.totalResults += 1;
        }

        await mealDocument.save();

        return {
          mealStyle: mealDocument.mealStyle,
          cuisine: mealDocument.cuisine,
          meals: mealDocument.meals,
          offset: mealDocument.offset,
          number: mealDocument.number,
          totalResults: mealDocument.totalResults,
        };
      } catch (error) {
        console.error('Error adding meal: ', error);
        throw new Error('Failed to add meal.');
      }
    },

    async deleteMeal(_, { mealStyle, cuisine, mealId }, context) {
      if (!context.user) {
        throw new Error('Unauthorized');
      }

      try {
        let mealDocument = await Meal.findOne({ mealStyle, cuisine });

        if (!mealDocument) {
          throw new Error('No meal data found for the given query.');
        }

        mealDocument.meals = mealDocument.meals.filter((meal) => meal.id !== mealId);
        mealDocument.totalResults = Math.max(0, mealDocument.totalResults - 1);

        await mealDocument.save();

        return {
          mealStyle: mealDocument.mealStyle,
          cuisine: mealDocument.cuisine,
          meals: mealDocument.meals,
          offset: mealDocument.offset,
          number: mealDocument.number,
          totalResults: mealDocument.totalResults,
        };
      } catch (error) {
        console.error('Error deleting meal: ', error);
        throw new Error('Failed to delete meal.');
      }
    },
  },
};

module.exports = mealResolver;
