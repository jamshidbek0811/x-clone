"use client"

import Form from "@/components/shared/form"
import Header from "@/components/shared/header"
import PostItem from "@/components/shared/post-item"
import { IPost } from "@/types"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const HomePage = () => {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<IPost[]>([])


  useEffect(() => {
    const getPosts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/posts?limit=10`, )        
        setPosts(data)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }

    getPosts()
  },[])
  return (
    <>
      <Header label="Home" isBack />
      {loading || status === "loading" ? (
        <div className=" flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500"/>
        </div>
      ) : (
        <>
          <Form placeholder="What's happening.." user={JSON.parse(JSON.stringify(session?.user))} setPosts={setPosts}/>
          {posts.map(post => (
            <PostItem key={post._id} post={post} setPosts={setPosts} user={JSON.parse(JSON.stringify(session?.user))}/>
          ))}
        </>
      )}
    </>
  )
}

export default HomePage