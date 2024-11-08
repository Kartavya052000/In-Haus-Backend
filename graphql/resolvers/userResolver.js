const userController = require('../../Controllers/userController');

const userResolver = {
  Mutation: {
    signup: (_, args) => userController.signup(args),
    login: (_, args) => userController.login(args),
    googleSignIn:(_,args) => userController.googleSignIn(args),
    forgotPassword: async (_, { email }) => {
      return await userController.forgotPassword(email);
    },

    resetPassword: async (_, { resetToken, newPassword }) => {
      return await userController.resetPassword(resetToken, newPassword);
    },

    // Protected mutation
    
  },
  Query: {
    hello: () => 'Hello world!',
    // Add other queries here
    // Protected query, requires authentication

    // myProfile: async (_, __, { user }) => {
    //   // console.log('Received user in resolver:', user); 
    //   if (!user || !user.userId) {
    //     throw new Error('Authentication required');
    //   }
    //   // Pass the userId to the getProfile function
    //   return await userController.getProfile(user.userId);  
    // },
    myProfile: async (_, {  },context) => {
      const user = context.user; // Get the authenticated user from context
console.log(user,"user");
      if (!user || !user.userId) {
        throw new Error("Unauthorized! You must be logged in to access this information.");
      }

      try {
        const userProfile = await userController.myProfile(user.userId); // Assuming _id is the user’s ID
        if (!userProfile) {
          throw new Error('User not found');
        }
        return userProfile;
      } catch (error) {
        throw new Error('Failed to fetch profile: ' + error.message);
      }
    },
  },
};

module.exports = userResolver;

