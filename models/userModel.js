import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must contain atleast 6 characters"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
