import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IUser } from "@/types";

const User = ({ user }: { user: IUser}) => {
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
            {user.username ? user.username : user.email} 
          </p>
        </div>
      </div>
    </div>
  )
}

export default User