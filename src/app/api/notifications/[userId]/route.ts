import Notification from "@/database/notification-model";
import user from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { userId: string }}) {
    try {
        await connectToDatabase()
        const { userId } = route.params

        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 })
        await user.findByIdAndUpdate(userId, { hasNewNotification: false })

        return NextResponse.json(notifications)
    } catch (error: any) {
        return NextResponse.json({message: error.message, succes: false})
    }
}

export async function DELETE(req: Request, route: { params: { userId: string }}) {
    try {
        await connectToDatabase()
        const { userId } = route.params

        await Notification.deleteMany({ user: userId })
        await user.findByIdAndUpdate(userId, { hasNewNotification: false }, { new: true })
        return NextResponse.json({ succes: true })
    } catch (error: any) {
        return NextResponse.json({message: error.message, succes: false})
    }
}