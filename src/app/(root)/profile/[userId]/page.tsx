import ProfileBio from "@/components/profile/profile-bio"
import ProfileHero from "@/components/profile/profile-hero"
import Header from "@/components/shared/header"
import PostFed from "@/components/shared/post-fed"
import { getUserById } from "@/lib/actions/user.action"
import { authOptions } from "@/lib/auth-options"
import { IUser } from "@/types"
import { getServerSession } from "next-auth"

const Profile = async({ params }: { params: { userId: string }}) => {
    const session = await getServerSession(authOptions)
    const user: IUser = await getUserById(params.userId)
    
  return (
    <>
        <Header label={user.name as string} isBack />
        <ProfileHero user={JSON.parse(JSON.stringify(user))}/>
        <ProfileBio user={JSON.parse(JSON.stringify(user))} userId={JSON.parse(JSON.stringify(session)).user._id}/>
        <PostFed userId={params.userId} user={JSON.parse(JSON.stringify(session?.user))} />
    </>
  )
}

export default Profile