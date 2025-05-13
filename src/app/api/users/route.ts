import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import user from "../../../database/user.model";

export async function GET(req: Request) {
    try {
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get("limit")
        const users = await user.find({}).select("name username _id email profileImage").limit(Number(limit))
        return NextResponse.json(users)
    } catch (error: any) {
        return NextResponse.json({ succes: false, message: error.message})
    }
}