"use client"

import Header from "@/components/shared/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { IUser } from "@/types"
import axios from "axios"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { debounce } from 'lodash'

const Explore = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [allUser, setAllUser] = useState<IUser[]>([])
    const [users, setUsers] = useState<IUser[]>([])

    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`/api/users?limit=20`)
            setAllUser(data)
            setUsers(data)
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    }

    const handleChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true)
        const text = e.target.value.toLocaleLowerCase()
        if(text && text.length > 2){
            const { data } = await axios.get(`/api/users/search/${text}`)
            setUsers(data)
            setIsLoading(false)
        } else {
            setUsers(allUser)
            setIsLoading(false)
        }
    }

    const debunceSearch = debounce(handleChange, 800)
    
    useEffect(() => {
        getAllUsers()
    },[])

    return (
      <>
        <Header label="Explore" isBack/> 
        <div className="relative px-4">
            <Input placeholder="Search for user" className="mt-2 w-full border-none bg-neutral-900 text-white" onChange={debunceSearch} />
            <div className='absolute rounded-md h-14 w-14 flex items-center justify-center hover:bg-slate-300 hover:bg-opacity-10 right-4 top-1/2 -translate-y-1/2 cursor-pointer'>
				<Search className='text-white' size={28} />
			</div>
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="animate-spin text-sky-500"/>
            </div>
        ) : (
            <>
                <div className="grid md:grid-cols-2 grid-cols-1 mt-6">
                    {users.length > 0 ? users.map((user) => (
                        <Link key={user._id} href={`/profile/${user._id}`}>
                            <div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative mr-4'>
									<div className='flex flex-row gap-4'>
										<Avatar>
											<AvatarImage src={user.profileImage} />
											<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
										</Avatar>

										<div className='flex flex-col'>
											<p className='text-white font-semibold cursor-pointer capitalize'>{user.name}</p>

											<span className='text-neutral-500 cursor-pointer md:block'>
												{`@${user.username ? user.username.slice(0, 16) : user.email?.slice(0, 16)}`}
											</span>
										</div>
									</div>
								</div>
                        </Link>
                    )) : (
                        <div className="px-4">User is not found</div>
                    )}
                </div>
            </>
        )}
      </>
    )
}

export default Explore