import Post from "@/database/post.model";
import user from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { postId: string } }) {
    try {
        await connectToDatabase()
        const { postId } = route.params

        const post = await Post.findById(postId).populate({
            path: "user",
            model: user,
            select: "_id name email profileImage username"
        })

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({succes: false, message: error})
    }
}