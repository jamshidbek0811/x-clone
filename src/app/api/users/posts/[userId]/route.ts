import user from "@/database/user.model"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongoose"
import { getServerSession } from "next-auth"
import PostModel from "@/database/post.model"
import { NextResponse } from "next/server"

export async function GET(req: Request, route: { params: { userId: string }}) {
    try {
        const session: any = await getServerSession(authOptions)
        
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get("limit")

        const posts = await PostModel.find({ user: route.params.userId }).populate({
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
