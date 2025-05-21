"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth-options"

export async function getUserById(userId: string, profileId?: string) {
    try {
        await connectToDatabase()

        const session: any = await getServerSession(authOptions)
        const user = await User.findById(userId)
        const filteredProfile = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            coverImage: user.coverImage,
            profileImage: user.profileImage,
            bio: user.bio,
            location: user?.location,
            createdAt: user.createdAt,
            followers: user.followers?.length || 0,
            following: user.following?.length || 0,
            isFollowing: user.followers?.includes(session?.user?._id) || false 
        }

        return filteredProfile
    } catch (error) {
        throw error    
    }
}