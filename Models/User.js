const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Destructure Schema from mongoose
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,  // Default points value is 0
    },
    redeemedRewards: [{
      rewardId: { type: Schema.Types.ObjectId, ref: 'Reward' },
      name: { type: String, required: true },                
      pointsAssigned: { type: Number, required: true },           
      category: { type: String, required: true }, 
      redeemedAt: { type: Date, default: Date.now }
    }],
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],  // Field to store group IDs (optional)

    resetPasswordToken: String,  
    resetPasswordExpires: Date,  
  },

  {
    timestamps: true, 
  }
);

// Hash the password before saving the user to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
