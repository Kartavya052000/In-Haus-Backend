const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('../graphql/schema');
const authenticate = require('../Middlewares/authMiddleware');

const router = express.Router();

// Change '/' to '/graphql'
router.all(
  '/graphql',
  createHandler({
    schema,
    context: (req) => {
      let user = null;
      try {
        // Only authenticate if Authorization header is present
        if (req.headers.authorization) {
          user = authenticate(req); // Verify JWT and get user info
          // console.log('Authenticated user:', user); 
        }
      } catch (error) {
        console.log('Authentication error:', error.message);
      }
      return { user }; // Pass authenticated user to context
    },
    graphiql: true, // Enable GraphiQL interface
  })
);

module.exports = router;
