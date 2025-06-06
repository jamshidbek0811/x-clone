"use client"

import { IPost, IUser } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatDistanceToNowStrict } from "date-fns"
import { AiOutlineMessage } from "react-icons/ai"
import { AiFillDelete } from 'react-icons/ai'
import { FaHeart } from 'react-icons/fa'
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import React, { Dispatch, SetStateAction, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  post: IPost
  user: IUser
  setPosts: Dispatch<SetStateAction<IPost[]>>
}

const PostItem = ({ post, user, setPosts }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onDelete = async (e: any) => {
    e.stopPropagation()
    setLoading(true)
    try {
      await axios.delete("/api/posts", {
        data: {
          postId: post._id
        }
      })
      setPosts((prev) => prev.filter(p => p._id !== post._id))
    } catch (error) {
      toast({ title : "Error", description: "Something went error!"})
    } finally {
      setLoading(false)
    }
  }

  const onLike = async (e: any) => {
    e.stopPropagation()
    setLoading(true)
    try {
      if(post.hasLiked){
        await axios.delete(`/api/likes`, {
          data: {
            postId: post._id,
            userId: user._id
          }
        })
        const updatedPost = {...post, hasLiked: false, likes: post.likes - 1 }
        setPosts((prev) => prev.map((p) => p._id === post._id ? updatedPost : p))
      }else {
        await axios.put(`/api/likes`, {
          postId: post._id,
          userId: user._id
        })
        const updatedPost = {...post, hasLiked: true, likes: post.likes + 1 }
        setPosts((prev) => prev.map((p) => p._id === post._id ? updatedPost : p))
      }
    } catch (error) {
      toast({ title : "Error", description: "Something went error!"})
    }
    setLoading(false)
  }

  const goToPost = () => {
    router.push(`/posts/${post._id}`)
  }

  const goToProfile = (evt: React.FormEvent) => {
    evt.stopPropagation()
    router.push(`/profile/${post.user._id}`)
  }
  return (
    <div  className='border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative'>
      {loading && (
				<div className='absolute inset-0 w-full h-full bg-black opacity-50'>
					<div className='flex justify-center items-center h-full'>
						<Loader2 className='animate-spin text-sky-500' />
					</div>
				</div>
			)}
      <div className='flex flex-row items-center gap-3 cursor-pointer' onClick={goToPost}>
				<Avatar onClick={goToProfile}>
					<AvatarImage src={post.user.profileImage} />
					<AvatarFallback>{post.user.name?.charAt(0)}</AvatarFallback>
				</Avatar>
        <div>
          <div className='flex flex-row items-center gap-2' onClick={goToProfile}>
						<p className='text-white font-semibold cursor-pointer hover:underline'>{post.user.name}</p>
						<span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
							{post.user.username ? `@${post.user.username.slice(0, 8)}...` : `${post.user.email?.slice(0, 8)}...`}
						</span>
						<span className='text-neutral-500 text-sm'>{formatDistanceToNowStrict(new Date(post.createdAt))} ago</span>
					</div>

          <div className='text-white mt-1'>{post.body}</div>

          <div className='flex flex-row items-center mt-3 gap-10'>
            <div className='flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500'>
                <AiOutlineMessage size={20} />
                <p>{post.comments || 0}</p>
              </div>

              <div
                className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
                role='button'
                onClick={onLike}
              >
                <FaHeart size={20} color={post.hasLiked ? 'red' : ''} />
                <p>{post.likes || 0}</p>
              </div>

              {post.user._id === user._id && (
                <div
                  className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
                  onClick={onDelete}
                  role='button'
                >
                  <AiFillDelete size={20} />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem