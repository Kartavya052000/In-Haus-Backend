const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require("nodemailer");


// SignUp Function
exports.signup = async ({ username, email, password }) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email.");
  }

  // Create new user
  const newUser = new User({ username, email, password });
  await newUser.save();

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error('JWT secret is not defined.');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: newUser._id }, secretKey, {
    expiresIn: "1d",
  });

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    points: newUser.points,
    token,
  };
};


// Login function
exports.login = async ({ email, password }) => {

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found with this email.');
  }

  // Compare provided password with stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password.');
  }

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error('JWT secret is not defined.');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, secretKey, {
    expiresIn: "1d",
  });
  
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    points: user.points, 
    token,
  };
};

// exports.getProfile = async (userId) => {
//   try {
//     // console.log('Received userId:', userId);

//     // Fetch the user from the database by their ID
//     const user = await User.findById(userId).select('-password'); // Exclude password

//     if (!user) {
//       // console.log('User not found for userId:', userId);
//       throw new Error('User not found');
//     }

//     // console.log('User found:', user);
//     return user;
//   } catch (error) {
//     console.error('Error in getProfile:', error); // Log any error that occurs
//     throw error;
//   }
// };


// Forgot Password Function
exports.forgotPassword = async (email) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found with this email.');
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(3).toString('hex');

  // Hash reset token with expiration time (1 hour)
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
  await user.save();

  // Log the reset token (Have to send in email)
  // console.log(`Password reset token for ${email}: ${resetToken}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email@gmail.com', //Change this to actual email
      pass: 'password', //Change this to actual password
    },
  });

    const mailOptions = {
    from: '"In-Haus" <email@gmail.com>', 
    to: email,                                       
    subject: 'Password Reset Request',               
    text: `Your reset password token is ${resetToken}`,
    html: `<p>Your reset token is: <strong>${resetToken}</strong></p>`, 
  };

   // Send email with the reset token
   try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset token sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('There was an error sending the email. Try again later.');
  }

  return {
    message: 'Password reset token sent to email'
  };
};


// Reset Password Function
exports.resetPassword = async (resetToken, newPassword) => {
  // Hash provided reset token 
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Find user by hashed reset token and check expiration
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },  // Check if token is valid 
  });

  if (!user) {
    throw new Error('Token is invalid or has expired');
  }

  // Update user password
  user.password = newPassword;
  user.resetPasswordToken = undefined; // Clear reset token
  user.resetPasswordExpires = undefined; // Clear expiration
  await user.save();

  return {
    message: 'Password has been updated successfully'
  };
};
