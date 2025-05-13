import { connectToDatabase } from "@/lib/mongoose"
import User from "../../../../database/user.model"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        await connectToDatabase()
        
        const isExistUser = await User.findOne({ email: email })
        if(!isExistUser){
            return NextResponse.json({succes: false, message: "User is not defined at this email!", status: 400})
        }
        
        const isPasswordValid = await bcrypt.compare(password, isExistUser.password)
        if(!isPasswordValid){
            return NextResponse.json({succes: false, message: "Invalid password!", status: 400})
        }

        return NextResponse.json({succes: true, user: isExistUser})
    } catch (error) {
        const result = error as Error
        return NextResponse.json({error: result.message, status: 400})
    }
}