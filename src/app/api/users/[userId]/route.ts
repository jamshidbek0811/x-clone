import user from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache'

export async function PUT(req: Request, route: { params: { userId: string }}) {
    try {
        await connectToDatabase()

        const body = await req.json()
        const { userId } = route.params

        const { searchParams } = new URL(req.url)
		const type = searchParams.get('type')

		if (type === 'updateImage') {
			await user.findByIdAndUpdate(userId, body, { new: true })
			revalidatePath(`/profile/${userId}`)
			return NextResponse.json({ message: 'User updated successfully' })
		} else if (type === 'updateFields') {
			const existUser = await user.findById(userId)

			if (body.username !== existUser.username) {
				const usernameExist = await user.exists({ username: body.username })
				if (usernameExist) {
					return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
				}
			}
			await user.findByIdAndUpdate(userId, body, { new: true })
			revalidatePath(`/profile/${userId}`)
			return NextResponse.json({ message: 'User updated successfully' })
		}
        await user.findByIdAndUpdate(userId, body, { new: true })
        return NextResponse.json({message: "User updated succesfully!"})
    } catch (error: any) {
        return NextResponse.json({error: error.message})
    }
}