import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/database/comment.model"
import { NextResponse } from "next/server";
import Post from "@/database/post.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Notification from "@/database/notification-model";
import user from "@/database/user.model";

export async function POST(req: Request) {
    try {
        await connectToDatabase()
        const { body, postId, userId } = await req.json()

        const comment = await Comment.create({ body, post: postId, user: userId })
        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
        })

        await Notification.create({ user: String(post.user), body: `Someone replied on your post!`})
        await user.findByIdAndUpdate(post.user, { hasNewNotification: true })

        return NextResponse.json(comment)
    } catch (error: any) {
        return NextResponse.json({ succes: false, message: error.message})
    }
}

export async function PUT(req: Request) {
    try {
        const { user }: any = await getServerSession(authOptions)
        await connectToDatabase()
        const { commmentId } = await req.json()
        const comment = await Comment.findByIdAndUpdate(commmentId, {
            $push: { likes: user._id }
        })

        await Notification.create({ user: String(comment.user), body: `Someone liked on your replied post!`})
        await user.findByIdAndUpdate(comment.user, { hasNewNotification: true })

        return NextResponse.json({ message: "Comment liked!"})
    } catch (error: any) {
        return NextResponse.json({ succes: false, message: error.message})
    }
}

export async function DELETE(req: Request) {
    try {
        const { user }: any = await getServerSession(authOptions)
        await connectToDatabase()
        const { commmentId } = await req.json()
        await Comment.findByIdAndUpdate(commmentId, {
            $pull: { likes: user._id }
        })
        return NextResponse.json({ message: "Comment disliked!"})
    } catch (error: any) {
        return NextResponse.json({ succes: false, message: error.message})
    }
}