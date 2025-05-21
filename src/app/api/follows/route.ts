import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model"
import { NextResponse } from "next/server";
import user from "@/database/user.model";
import Notification from "@/database/notification-model";

export async function PUT(req: Request) {
    try {
        await connectToDatabase()
        const { userId, currentUserId } = await req.json()

        await User.findByIdAndUpdate(userId, {
            $push: { followers: currentUserId }
        })

        await User.findByIdAndUpdate(currentUserId, {
            $push: { following: userId }
        })

        await Notification.create({ user: userId, body: `Someone followed you!`})
        await User.findByIdAndUpdate(userId, { hasNewNotification: true })

        return NextResponse.json({ succes: true })
    } catch (error: any) {
        return NextResponse.json({ message: error.message })
    }
}

export async function DELETE(req: Request) {
    try {
        await connectToDatabase()
        const { userId, currentUserId } = await req.json()

        await User.findByIdAndUpdate(userId, {
            $pull: { followers: currentUserId}
        })

        await User.findByIdAndUpdate(currentUserId, {
            $pull: { following: userId }
        })

        return NextResponse.json({ succes: true })
    } catch (error: any) {
        return NextResponse.json({ message: error.message })
    }
}

export async function GET(req: Request) {
    try {
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")
        const state = searchParams.get("state")

        const currentUser = await user.findById(userId)

        if(state === "following"){
            const following = await user.find({ _id: { $in: currentUser.following }})
            return NextResponse.json(following)
        } else if(state === "followers"){
            const followers = await user.find({ _id: { $in: currentUser.followers }})
            return NextResponse.json(followers)
        }
        return NextResponse.json({ succes: true })
    } catch (error: any) {
        return NextResponse.json({ message: error.message })
    }
}