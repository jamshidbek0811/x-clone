import user from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { query: string }}) {
    try {
        await connectToDatabase()
        const { query } = route.params
        
        const users = await user.find({
            $or: [
                { name: { $regex: query, $options: "i"} },
                { username: { $regex: query, $options: "i"} },
                { email: { $regex: query, $options: "i"} },
            ]
        }).select("name username email _id profileImage")
        
        return NextResponse.json(users)
    } catch (error: any) {
        return NextResponse.json({ message: error.message})
    }
}