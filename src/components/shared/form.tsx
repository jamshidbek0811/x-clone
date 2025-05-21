"use client"

import { IPost, IUser } from "@/types"
import { Dispatch, SetStateAction, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Button from "../ui/button"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

interface Props {
    placeholder: string
    user: IUser
    setPosts: Dispatch<SetStateAction<IPost[]>>
    postId?: string
    isComment?: boolean
}

const Form = ({ placeholder, isComment, postId, user, setPosts }: Props) => {
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        try {
          setLoading(true)
          if(isComment){
            const { data } = await axios.post(`/api/comments`, {
              body: body,
              userId: user._id,
              postId
            })

            const newComment = {...data, user, likes: 0, hasLiked: false }
            setPosts(prev => [newComment, ...prev])
          }else {
            const { data } = await axios.post('/api/posts', { body, userId: user._id })
            const newPost = { ...data, user, likes: 0, hasLiked: false, comments: 0 }
            setPosts((prev) => [newPost, ...prev])
          }
          setBody("")
        } catch (error) {
          toast({ title: "Error", description: "Something went error! Please leter again!", variant: "destructive"})
        } finally {
          setLoading(false)
        }
    }

    return (
      <div className='border-b-[1px] border-neutral-800 px-5 py-2'>
        <div className='flex flex-row gap-4'>
          <Avatar>
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="w-full">
            <textarea
              className='disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white h-[50px]'
              placeholder={placeholder}
              disabled={loading}
              value={body}
              onChange={e => setBody(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSubmit()}
            ></textarea>
            <hr className='opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition' />
            <div className='mt-4 flex flex-row justify-end'>
              <Button 
                label={isComment ? "Reply" : "Post"}
                classNames='px-8'
                onClick={onSubmit}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    )
}

export default Form