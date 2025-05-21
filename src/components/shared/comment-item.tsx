import { IPost, IUser } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatDistanceToNowStrict } from "date-fns"
import { FaHeart } from "react-icons/fa"
import { AiFillDelete, AiOutlineMessage } from "react-icons/ai"
import { Dispatch, SetStateAction, useState } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const CommentItem = ({ comment, user, setComments, comments }: { comment: IPost, user: IUser, setComments: Dispatch<SetStateAction<IPost[]>>, comments: IPost[] }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const onLike = async () => {
        try {
            setIsLoading(true)
            if(comment.hasLiked){
                await axios.delete(`/api/comments`, {
                    data: {
                        commmentId: comment._id
                    }
                })
                const updateData = comments.map(c => {
                    if(c._id === comment._id){
                        return {...c, hasLiked: false, likes: c.likes - 1 }
                    }

                    return c
                })
                setComments(updateData)
            }else {
                await axios.put(`/api/comments`, {
                    data: {
                        commmentId: comment._id
                    }
                })

                const updateData = comments.map(c => {
                    if(c._id === comment._id){
                        return {...c, hasLiked: true, likes: c.likes + 1 }
                    }

                    return c
                })
                setComments(updateData)
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/comments/${comment._id}`, {
                data: {
                    commmentId: comment._id
                }
            })
            setComments(prev => prev.filter(c => c._id !== comment._id))
        } catch (error) {
            console.log(error);
        } finally{
            setIsLoading(false)
        }
    }

    const goToProfile = (evt: React.FormEvent) => {
      evt.stopPropagation()
      router.push(`/profile/${user._id}`)
    }
  return (
    <div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 relative transition'>
        {isLoading && (
            <div className='absolute inset-0 w-full h-full bg-black opacity-60'>
                <div className='flex justify-center items-center h-full'>
                    <Loader2 className='animate-spin text-sky-500' />
                </div>
            </div>
        )}
            <div className='flex flex-row items-center gap-3'>
                <Avatar onClick={goToProfile}>
                    <AvatarImage src={comment?.user.profileImage} />
                    <AvatarFallback>{comment?.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className='flex flex-row items-center gap-2' onClick={goToProfile}>
                        <p className='text-white font-semibold cursor-pointer hover:underline'>{comment?.user.name}</p>
                        <span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
                            {comment && comment?.user.username ? comment.user.username.slice(0, 20) : comment && comment.user.email?.slice(0, 20)}
                        </span>
                        <span className='text-neutral-500 text-sm'>
                            {comment && comment.createdAt && formatDistanceToNowStrict(new Date(comment.createdAt))}
                        </span>
                    </div>
                    <div className='text-white mt-1'>{comment?.body}</div>

                    <div className='flex flex-row items-center mt-3 gap-10'>
                        <div
                            className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
                            role='button'
                            onClick={onLike}
                        >
                            <FaHeart size={20} color={comment.hasLiked ? 'red' : ''} />
                            <p>{comment.likes || 0}</p>
                        </div>

                        {comment.user._id === user._id && (
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

export default CommentItem