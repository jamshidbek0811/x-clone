import Post from "@/database/post.model";
import Comment from "@/database/comment.model"
import user from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

export async function GET(req: Request, route: { params: { postId: string } }) {
    try {
        await connectToDatabase()
        const session: any = await getServerSession(authOptions)
        const { postId } = route.params

        const post = await Post.findById(postId).populate({
            path: "comments",
            model: Comment,
            populate: {
                path: "user",
                model: user,
                select: "_id name email profileImage username"
            },
            options: { sort: { likes: -1 } }
        })

        const filteredData = post.comments.map((item: any) => ({
            body: item.body,
            createdAt: item.createdAt,
            user: {
                _id: item.user.id,
                name: item.user.name,
                username: item.user.username,
                profileImage: item.user.profileImage,
                email: item.user.email
            },
            likes: item.likes.length,
            hasLiked: item.likes.includes(session.user._id),
            _id: item._id
        }))
        return NextResponse.json(filteredData)
    } catch (error) {
        return NextResponse.json({succes: false, message: error})
    }
}