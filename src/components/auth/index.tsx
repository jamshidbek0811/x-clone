"use client"

import Image from "next/image"
import Button  from "../ui/button"
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import useRegisterModal from "@/hooks/useRegisterModal"
import useLoginModal from "@/hooks/useLoginModel"
import { useCallback } from "react"
import RegisterModal from "../modals/register-modal"
import LoginModal from "../modals/login-modal"
import { signIn, useSession } from "next-auth/react"

const Auth = () => {
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const { data } = useSession()

  const onOpenRegisterModal = useCallback(() => {
    registerModal.onOpen()
  }, [registerModal])

  const onOpenLoginModal = useCallback(() => {
    loginModal.onOpen()
  }, [loginModal])
  return (
    <>
        <RegisterModal />
        <LoginModal />
        <div className="grid items-center md:grid-cols-2 grid-cols-1 gap-10 h-screen max-md:px-2">
            <Image
                src={"/images/x.svg"}
                alt="X"
                width={450}
                height={450}
                className="justify-self-center hidden md:block"
             />

             <div className="flex flex-col md:justify-between justify-center max-md:gap-y-10 h-full md:h-[70vh]">
                <div className="md:hidden block">
                  <Image
                    src={"/images/x.svg"}
                    alt="X"
                    width={50}
                    height={50}
                    className="justify-self-center"
                />
                </div>
                <h1 className="text-6xl font-bold">Happening now</h1>
                <div className="w-full md:w-[60%]">
                  <h2 className="font-bold text-3xl mb-4">Join today.</h2>
                  <div className="flex flex-col space-y-2">
                    <Button  onClick={() => signIn("google")} label={
                      <div className="flex gap-2 items-center justify-center">
                        <FcGoogle />
                        Signup with Google
                      </div>
                      } fullWidth secondary/>
                    <Button onClick={() => signIn("github")} label={
                      <div className="flex gap-2 items-center justify-center">
                      <AiFillGithub />
                      Signup with GitHub
                    </div>
                    } fullWidth secondary />

                    <div className="flex items-center justify-center">
                      <div className="h-px bg-gray-800 w-1/2"></div>
                      <p className="px-4">Or</p>
                      <div className="h-px bg-gray-800 w-1/2"></div>
                    </div>
                    <Button label={"Create Account"} fullWidth onClick={onOpenRegisterModal}/>
                    <div className='text-[10px] text-gray-400'>
                      By signing up, you agree to the <span className='text-sky-500'>Terms of Service</span> and
                      <span className='text-sky-500'> Privacy Policy</span>, including
                      <span className='text-sky-500'> Cookie Use</span>.
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[60%]">
                  <h3 className="font-medium text-xl mb-4">Already has an account</h3>
                  <Button label={"Sign in"} fullWidth outline onClick={onOpenLoginModal}/>
                </div>
             </div>
        </div>
    </>
  )
}

export default Auth