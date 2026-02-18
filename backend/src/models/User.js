import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
  profilepic:{
    type: String,
    default: '',
  }
}, { timestamps: true }) //creates createdAt and updatedAt fields automatically

const User = mongoose.model('User', userSchema)

export default User