const userController = require('../../Controllers/userController');

const userResolver = {
  Mutation: {
    signup: (_, args) => userController.signup(args),
    login: (_, args) => userController.login(args),

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
  },
};

module.exports = userResolver;

