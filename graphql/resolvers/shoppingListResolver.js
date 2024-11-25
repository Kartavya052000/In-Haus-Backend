// resolvers/shoppingListResolver.js
const ShoppingList = require('../../Models/ShoppingList');
const User = require('../../Models/User');

const shoppingListResolver = {
  Query: {
    getShoppingLists: async (_, __, context) => {
        const user = context.user;
        if (!user || !user.userId) {
          throw new Error('Unauthorized! You must be logged in to fetch shopping lists.');
        }
      
        try {
          // Retrieve the user's group ID
          const user_initial = await User.findById(user.userId);
          const groupId = user_initial.groups[0]; // Assume the first group is the active one
      
          if (!groupId) {
            throw new Error('No group found for the user.');
          } 
      
          console.log('Group ID:', groupId);
      
          // Fetch shopping lists for the group
          const shoppingLists = await ShoppingList.find({ groupId });
      
          console.log('Fetched Shopping Lists:', shoppingLists);
      
          return shoppingLists.map((list) => ({
            groupId: list.groupId,
            mealId: list.shoppingListItems.length > 0 ? list.shoppingListItems[0].mealId : null,
            uniqueKey: list.shoppingListItems.length > 0 ? list.shoppingListItems[0].uniqueKey : null,
            mealTitle: list.shoppingListItems.length > 0 ? list.shoppingListItems[0].mealTitle : null,
            mealImage: list.shoppingListItems.length > 0 ? list.shoppingListItems[0].mealImage : null,
            ingredients: list.shoppingListItems.length > 0 ? list.shoppingListItems[0].ingredients : [],
          }));
        } catch (error) {
          console.error('Error fetching shopping lists:', error);
          throw new Error('Failed to fetch shopping lists.');
        }
      },
      
    },
  Mutation: {
    saveShoppingList: async (_, { shoppingListItems }, context) => {
        const user = context.user;
        if (!user || !user.userId) {
          throw new Error('Unauthorized! You must be logged in to save a shopping list.');
        }
      
        try {
          // Retrieve the user's group ID
          const user_initial = await User.findById(user.userId);
          const groupId = user_initial.groups[0]; // Assume the first group is the active one
      
          if (!groupId) {
            throw new Error('No group found for the user.');
          }
      
          console.log('Group ID:', groupId);
          console.log('Incoming Shopping List Items:', shoppingListItems);
      
          // Check if a shopping list exists for the group
          const existingList = await ShoppingList.findOne({ groupId });
          console.log('Existing List:', existingList);
      
          if (existingList) {
            // Update the shopping list
            existingList.shoppingListItems = shoppingListItems.map((item) => ({
              mealId: item.mealId,
              uniqueKey: item.uniqueKey,
              mealTitle: item.mealTitle,
              mealImage: item.mealImage,
              ingredients: item.ingredients.map((ingredient) => ({
                id: ingredient.id,
                uniqueKey: ingredient.uniqueKey,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                checked: ingredient.checked,
              })),
            }));
            existingList.updatedAt = new Date();
            await existingList.save();
      
            console.log('Updated List Saved:', existingList);
      
            return {
              groupId,
              shoppingListItems: existingList.shoppingListItems,
            };
          } else {
            // Create a new shopping list
            const newList = new ShoppingList({
              groupId,
              shoppingListItems: shoppingListItems.map((item) => ({
                mealId: item.mealId,
                uniqueKey: item.uniqueKey,
                mealTitle: item.mealTitle,
                mealImage: item.mealImage,
                ingredients: item.ingredients.map((ingredient) => ({
                  id: ingredient.id,
                  uniqueKey: ingredient.uniqueKey,
                  name: ingredient.name,
                  amount: ingredient.amount,
                  unit: ingredient.unit,
                  checked: ingredient.checked,
                })),
              })),
            });
            await newList.save();
      
            console.log('New List Created and Saved:', newList);
      
            return {
              groupId,
              shoppingListItems: newList.shoppingListItems,
            };
          }
        } catch (error) {
          console.error('Error saving shopping list:', error);
          throw new Error('Failed to save shopping list.');
        }
      },
      
    addShoppingList: async (_, { groupId, shoppingList }, context) => {
        const user = context.user;
        if (!user || !user.userId) {
          throw new Error('Unauthorized! You must be logged in to add shopping lists.');
        }
      
        try {
          const newShoppingList = new ShoppingList({
            ...shoppingList,
            groupId,
            ingredients: shoppingList.ingredients.map((ingredient) => ({
              id: ingredient.id,
              uniqueKey: ingredient.uniqueKey,
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              checked: ingredient.checked,
            })),
          });
      
          const savedList = await newShoppingList.save();
          return savedList;
        } catch (error) {
          console.error('Error adding shopping list:', error);
          throw new Error('Failed to add shopping list.');
        }
      },
      
    editShoppingList: async (_, { shoppingListId, shoppingList }, context) => {
      const user = context.user;
      if (!user || !user.userId) {
        throw new Error('Unauthorized! You must be logged in to edit shopping lists.');
      }

      try {
        const updatedList = await ShoppingList.findByIdAndUpdate(
          shoppingListId,
          { ...shoppingList, updatedAt: new Date() },
          { new: true }
        );

        if (!updatedList) {
          throw new Error('Shopping list not found.');
        }

        return updatedList;
      } catch (error) {
        throw new Error('Failed to edit shopping list.');
      }
    },
    deleteShoppingList: async (_, { shoppingListId }, context) => {
      const user = context.user;
      if (!user || !user.userId) {
        throw new Error('Unauthorized! You must be logged in to delete shopping lists.');
      }

      try {
        const deletedList = await ShoppingList.findByIdAndDelete(shoppingListId);

        if (!deletedList) {
          throw new Error('Shopping list not found.');
        }

        return 'Shopping list deleted successfully.';
      } catch (error) {
        throw new Error('Failed to delete shopping list.');
      }
    },
  },
};

module.exports = shoppingListResolver;