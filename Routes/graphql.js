const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('../graphql/schema');

const router = express.Router();

// Change '/' to '/graphql'
router.all(
  '/graphql',
  createHandler({
    schema,
    graphiql: true, // Enable GraphiQL interface
  })
);

module.exports = router;
