import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    username: {
      type: String,
      trim: true,
      unique: false,
      sparse: true, 
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId; 
      },
    },

    photo: String,
      phone: {
      type: String,
      trim: true,
    },

    about: {
      type: String,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }]
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
