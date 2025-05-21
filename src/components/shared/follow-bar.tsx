"use client"

import Link from "next/link"
import Button from "../ui/button"
import { Loader2 } from "lucide-react"
import { IUser } from "@/types"
import User from "./user"
import useUsers from "@/hooks/use-user"

const FollowBar = () => {
  const { users, isLoading} = useUsers(7)

  return (
    <div className="py-4 hidden lg:block w-[366px]">
      <div className="bg-neutral-800 p-2 rounded-md">
        <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Who to follow</h2>
          <Link href="/explore">
            <Button
              secondary
              label={"See all"}
              classNames="h-[30px] p-0 w-fit px-3 text-sm"
            />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="flex flex-col mt-4">
            {users && users?.map((user: IUser) => (
              <Link key={user?._id} href={`/profile/${user._id}`}>
                <User user={user} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowBar