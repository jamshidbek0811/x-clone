"use client"

import { IPost, IUser } from "@/types"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import PostItem from "./post-item"

interface Props {
    userId: string
    user: IUser
}

const PostFed = ({ userId, user }: Props) => {
    const [isLoad, setIsLoad] = useState(false)
    const [posts, setPosts] = useState<IPost[]>([])

    const getPosts = async () => {
        try {
            setIsLoad(true)            
            const { data } = await axios.get(`/api/users/posts/${userId}`)
            setPosts(data)
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoad(false)
        }
    }

    useEffect(() => {
        getPosts()
    },[userId])
  return (
    <>
        {isLoad ? (
            <div className=" flex justify-center items-center h-24">
                <Loader2 className="animate-spin text-sky-500"/>
            </div>
        ) : (
            posts?.map(post => (
                <PostItem post={post} key={post._id} user={user} setPosts={setPosts}/>
            ))
        )}
    </>
  )
}

export default PostFed