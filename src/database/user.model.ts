import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    coverImage: String,
    profileImage: String
}, { timestamps: true })

const user = mongoose.models.User || mongoose.model("User", userSchema)
export default user