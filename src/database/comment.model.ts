import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
}, { timestamps: true })


const Post = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export default Post