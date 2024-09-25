const User = require('../Models/User');
const jwt = require('jsonwebtoken');

exports.signup = async ({ username, email, password }) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  // Create new user
  const newUser = new User({ username, email, password });
  await newUser.save();

  // Generate JWT token
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    token,
  };
};
