import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: false },
    // password: { type: String, required: true },
  },
  { timestamps: true }
);      

const User = mongoose.model("User", userSchema);

export default User;