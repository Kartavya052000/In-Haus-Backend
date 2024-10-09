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
