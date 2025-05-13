import { connectToDatabase } from "@/lib/mongoose"
import User from "../../../../database/user.model"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        await connectToDatabase()
        const { searchParams } = new URL(req.url)
        const step = searchParams.get("step")

        if(step === "1"){
            const { email } = await req.json()
            const existingUser = await User.findOne({ email: email })

            if(existingUser){
                return NextResponse.json({succes: false, message: "Email already exist", status: 400})
            }

            return NextResponse.json({succes: true})
        }

        if(step === "2"){
            const { email, username, name, password } = await req.json()
            const existingUser = await User.findOne({ username: username })

            if(existingUser){
                return NextResponse.json({succes: false, message: "Username already exist", status: 400})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ email, password: hashedPassword, username, name })
            return NextResponse.json({succes: true, user })
        }
    } catch (error) {
        const result = error as Error
        return NextResponse.json({error: result.message, status: 400})
    }
}