"use client"

import CommentItem from '@/components/shared/comment-item'
import Form from '@/components/shared/form'
import Header from '@/components/shared/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IPost } from '@/types'
import axios from 'axios'
import { formatDistanceToNowStrict } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = ({ params }: { params: { postId: string }}) => {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [isFetchingComment, setIsFetchingComment] = useState(false)
    const [post, setPost] = useState<IPost | null>(null)
    const [comments, setComments] = useState<IPost[]>([])

    const getPost = async () => {
        try {
            setLoading(true)            
            const { data }= await axios.get(`/api/posts/${params.postId}`)
            setPost(data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const getComments = async () => {
        try {
            setIsFetchingComment(true)            
            const { data }= await axios.get(`/api/posts/${params.postId}/comments`)
            setComments(data)
            setIsFetchingComment(false)
        } catch (error) {
            setIsFetchingComment(false)
            console.log(error);
        }
    }

    useEffect(() => {
        getPost()
        getComments()
    },[])
  return (
    <>
        <Header label='Posts' isBack/>
        {loading || status === "loading" ? (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="animate-spin text-sky-500"/>
            </div>
        ) : (
            <>
                <div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer bg-neutral-900 transition'>
				    <div className='flex flex-row items-center gap-3'>
                        <Avatar>
							<AvatarImage src={post?.user.profileImage} />
							<AvatarFallback>{post?.user.name?.charAt(0)}</AvatarFallback>
						</Avatar>

                        <div>
							<div className='flex flex-row items-center gap-2'>
								<p className='text-white font-semibold cursor-pointer hover:underline'>{post?.user.name}</p>
								<span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
									{post && post?.user.username ? post.user.username.slice(0, 20) : post && post.user.email?.slice(0, 20)}
								</span>
								<span className='text-neutral-500 text-sm'>
									{post && post.createdAt && formatDistanceToNowStrict(new Date(post.createdAt))}
								</span>
							</div>
							<div className='text-white mt-1'>{post?.body}</div>
						</div>
                    </div>
                </div>
                <Form isComment placeholder="Post your reply!" postId={params.postId} user={JSON.parse(JSON.stringify(session?.user))} setPosts={setComments}/>
                {isFetchingComment ? (
                    <div className=" flex justify-center items-center h-24">
                        <Loader2 className="animate-spin text-sky-500"/>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem comment={comment} comments={comments} key={comment._id} user={JSON.parse(JSON.stringify(session?.user))} setComments={setComments}/>
                    ))
                )}
            </>
        )}
    </>
  )
}

export default Page