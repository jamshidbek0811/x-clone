import { connectToDatabase } from "@/lib/mongoose";
import PostModel from "@/database/post.model";
import { NextResponse } from "next/server";
import user from "@/database/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
    try {
        await connectToDatabase()
        const { body, userId } = await req.json()
        const post = await PostModel.create({ body, user: userId })
        return NextResponse.json(post)
    } catch (error: any) {
        return NextResponse.json({succes: false, message: error})
    }
}

export async function GET(req: Request) {
    try {
        const session: any = await getServerSession(authOptions)
        
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get("limit")

        const posts = await PostModel.find({}).populate({
            path: "user",
            model: user,
            select: "name username profileImage _id email"
        }).limit(Number(limit)).sort({ createdAt: -1 })

        const filteredPosts = posts.map((post) => ({
            _id: post._id,
            body: post.body,
            createdAt: post.createdAt,
            user: {
                _id: post.user._id,
                name: post.user.name,
                username: post.user.username,
                profileImage: post.user.profileImage,
                email: post.user.email
            },
            likes: post.likes.length,
            comments: post.comments.length,
            hasLiked: post.likes.includes(session?.user?._id)
        }))
        return NextResponse.json(filteredPosts)
    } catch (error: any) {
        return NextResponse.json({succes: false, message: error})
    }
}

export async function DELETE(req: Request) {
    try {
        await connectToDatabase()
        const { postId, userId } = await req.json()
        const post = await PostModel.findByIdAndDelete(postId)
        return NextResponse.json({ message: "Post delete succesfully!"})
    } catch (error: any) {
        return NextResponse.json({succes: false, message: error})
    }
}