import Auth from "@/components/auth"
import { Toaster } from "@/components/ui/toaster"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { ReactNode } from "react"
import NextTopLoader from 'nextjs-toploader'
import FollowBar from "@/components/shared/follow-bar"
import Sidebar from "@/components/sidebar/sidebar"

interface Props {
    children: ReactNode
}

const Layout = async({ children }: Props) => {
    const session = await getServerSession(authOptions)
    if(!session?.user){
        return <div className="mx-auto md:max-w-7xl"><Auth /></div>
    }

  return (
    <div className="lg:container h-screen mx-auto md:max-w-7xl xl:max-w-[97%]">
      <div className="flex">
        <Sidebar user={JSON.parse(JSON.stringify(session?.user))}/>
        <div className="flex flex-1 border-x-[1px] border-neutral-800 lg:mx-4 ml-1">
          <div className="w-full">
            <NextTopLoader
                color="#2299DD"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              />
              {children}
              <Toaster />
          </div>
        </div>
        <FollowBar />
      </div>
    </div>
  )
}

export default Layout