"use client"

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import axios from "axios";

interface Props {
  user: IUser
  isFollow?: boolean
  following?: IUser[]
  onChangeFollowing?: (data: IUser[]) => void
}

const User = ({ user, onChangeFollowing, isFollow, following }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session }: any = useSession()

   const onFollow = async () => {
        try {
          setIsLoading(true)            
          const { data } = await axios.put(`/api/follows`, { userId: user._id, currentUserId: session?.user?._id })
          router.refresh()
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false)
        }
    }
  
    const onUnFollow = async () => {
      try {
            setIsLoading(true)            
            const { data } = await axios.delete(`/api/follows`, { data: { userId: user._id, currentUserId: session?.user?._id } })
            const updateFollowing = [...following as IUser[], user]
            onChangeFollowing && onChangeFollowing(updateFollowing as IUser[])
            router.refresh()
          } catch (error) {
              console.log(error);
          }finally {
              setIsLoading(false)
          }
    }
  return (
    <div className="flex gap-3 items-center justify-between cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 transition py-2 px-3 rounded-md">
      <div className="flex gap-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={user?.profileImage}/>
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm line-clamp-1 mb-1">
            {user.name}
          </p>
          <p className="text-neutral-400 text-sm line-clamp-1">
            @{user.username ? user.username : user.email} 
          </p>
        </div>
      </div>
      {isFollow && (
        user._id !== session?.user?._id ? (
          user?.followers?.includes(session?.user?._id as string) ? (
                <Button label={"Unfollow"} disabled={isLoading} onClick={onUnFollow} outline />
              ) : (
                <Button label={"Follow"} onClick={onFollow} disabled={isLoading}/>
            )
          ) : null
      )}
    </div>
  )
}

export default User