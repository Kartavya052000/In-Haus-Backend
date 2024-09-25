const userController = require('../../Controllers/userController');

const userResolver = {
  Mutation: {
    signup: (_, args) => userController.signup(args),

    // Add other mutations like login here
  },
  Query: {
    hello: () => 'Hello world!',
    // Add other queries here
  },
};

module.exports = userResolver;
