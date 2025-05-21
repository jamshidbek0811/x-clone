import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Comment from "@/database/comment.model"

export async function DELETE(req: Request, route: { params: { commentId: string }}) {
    try {
        await connectToDatabase()
        const { commentId } = route.params
        await Comment.findByIdAndDelete(commentId)
        return NextResponse.json({ succes: true})
    } catch (error: any) {
        return NextResponse.json({ succes: false, message: error.message})
    }
}