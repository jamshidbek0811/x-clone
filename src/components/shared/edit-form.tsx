"use client"

import { IUser } from "@/types"
import { userSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import Button from "../ui/button"
import { Textarea } from "../ui/textarea"
import axios from "axios"
import { useRouter } from "next/navigation"
import useEditModal from "@/hooks/use-edit-modal"
import { Toast } from "../ui/toast"

interface Props {
    user: IUser
}

const EditForm = ({ user }: Props) => {
    const router = useRouter()
    const editModal = useEditModal() 

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
		defaultValues: { name: user.name || '', username: user.username || '', bio: user.bio || '', location: user.location || '' },
	})

    const { isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof userSchema>) => {
        try {
            await axios.put(`/api/users/${user._id}?type=updateFields`, values)
            router.refresh()
            editModal.onClose()
        } catch (error: any) {
			alert(error.message);
        }
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 relative -top-8 mx-4'>
            <FormField
				control={form.control}
				name='name'
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input placeholder='Name' disabled={isSubmitting} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

            <FormField
				control={form.control}
				name='username'
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input placeholder='Username' disabled={isSubmitting} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

            <FormField
				control={form.control}
				name='location'
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input placeholder='Location' disabled={isSubmitting} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='bio'
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Textarea placeholder='Bio' disabled={isSubmitting} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Button type='submit' label={'Save'} secondary large fullWidth disabled={isSubmitting} isLoading={isSubmitting} />
        </form>
    </Form>
  )
}

export default EditForm