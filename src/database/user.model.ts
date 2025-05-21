import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    coverImage: String,
    profileImage: String,
    location: String,
    bio: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    hasNewNotification: Boolean,
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification"
        }
    ]
}, { timestamps: true })

const user = mongoose.models.User || mongoose.model("User", userSchema)
export default user