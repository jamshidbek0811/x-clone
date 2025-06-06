import { IUser } from '@/types'
import { signOut, useSession } from 'next-auth/react'
import { RiLogoutCircleLine } from 'react-icons/ri'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Loader2, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface Props {
	user: IUser
}

const SidebarAccount = ({ user }: Props) => {
	const { data, status } = useSession()

	if(status === "loading") return (
		<div className="flex justify-center items-center h-24">
			<Loader2 className="animate-spin text-sky-500" />
		</div>
	)
  return (
	<>
		<div className='lg:hidden block'>
			<div
				className='mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-red-500 hover:bg-opacity-80 transition cursor-pointer'
				onClick={() => signOut()}
			>
				<RiLogoutCircleLine size={24} color='white' />
			</div>
		</div>

		<Popover>
		<PopoverTrigger className='w-full rounded-full hover:bg-slate-300 hidden lg:block cursor-pointer hover:bg-opacity-10 px-4 py-2 transition'>
			<div className='flex justify-between items-center gap-2'>
				<div className='flex gap-2 items-center'>
					<Avatar>
						<AvatarImage src={user?.profileImage} />
						<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className='flex flex-col items-start text-white'>
						<p className='text-[14px] flex'>{user?.name}</p>
						{user?.username ? (
							<p className='opacity-40'>@{user?.username}</p>
						) : (
							<p className='opacity-40'>Manage account</p>
						)}
					</div>
				</div>
				<MoreHorizontal size={24} color='white'/>
			</div>
		</PopoverTrigger>

		<PopoverContent className='bg-black border-none rounded-sm shadow shadow-white/20 py-2 px-1 mb-3'>
			<div
				className='font-bold text-white cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 px-4 py-3 transition'
				onClick={() => signOut()}
			>
				Log out {user?.username ? `@${user?.username}` : user?.name}
			</div>
		</PopoverContent>
		</Popover>
	</>
  )
}

export default SidebarAccount