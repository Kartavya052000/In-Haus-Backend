const jwt = require('jsonwebtoken');

// Middleware to verify JWT and pass user information to GraphQL context
const authenticate = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Authorization header must be provided');
  }

  const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
  if (!token) {
    throw new Error('Authorization token must be in the format: Bearer <token>');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded Token:', decodedToken); 
    return decodedToken; 
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = authenticate;
