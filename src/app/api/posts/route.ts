import { connectToDatabase } from "@/lib/mongoose";
import PostModel from "@/database/post.model";
import { NextResponse } from "next/server";
import user from "@/database/user.model";

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
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get("limit")

        const posts = await PostModel.find({}).populate({
            path: "user",
            model: user,
            select: "name username profileImage _id email"
        }).limit(Number(limit)).sort({ createdAt: -1 })

        return NextResponse.json(posts)
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