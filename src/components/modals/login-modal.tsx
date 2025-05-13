import Modal from "../ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import useLoginModal from '@/hooks/useLoginModel'
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { loginSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import Button from "../ui/button"
import { useCallback, useState } from "react"
import useRegisterModal from "@/hooks/useRegisterModal"
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"

const LoginModal = () => {
  const [error, setError] = useState("")
  const loginModal = useLoginModal()
  const registerModal = useRegisterModal()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
      setError("")
      try {
        const response = await axios.post(`http://localhost:3000/api/auth/login`, values)
        if(response.data.succes){
          signIn("credentials", {
            email: values.email,
            password: values.password
          })
          loginModal.onClose()
        }else {
          setError(response.data.message)
        }
      } catch (error) {
        setError("Something went Error!")
      }
  }

  const onToggle = useCallback(() => {
    loginModal.onClose()
    registerModal.onOpen()
  },[loginModal, registerModal])
  
  const { isSubmitting } = form.formState 
  const bodyContent = <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-8">
    {error && (
      <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
    )}
   <FormField
     control={form.control}
     name="email"
     render={({ field }) => (
       <FormItem>
         <FormLabel>Email</FormLabel>
         <FormControl>
           <Input placeholder="Email" {...field} />
         </FormControl>
         <FormMessage />
       </FormItem>
     )}
   />

   <FormField
     control={form.control}
     name="password"
     render={({ field }) => (
       <FormItem>
         <FormLabel>Password</FormLabel>
         <FormControl>
           <Input placeholder="Password" {...field} />
         </FormControl>
         <FormMessage />
       </FormItem>
     )}
   />
 <Button label={"Login"} type="submit" secondary fullWidth large disabled={isSubmitting}/>
 </form>
</Form>

  const footer = <div className='text-neutral-400 text-center mb-4'>
    <p>
      First time using X?
      <span className='text-white cursor-pointer hover:underline' onClick={onToggle}>
        {' '}
        Create an account
      </span>
    </p>
  </div>
  return (
    <Modal isOpen={loginModal.isOpen} onClose={loginModal.onClose} body={bodyContent} footer={footer}/>
  )
}

export default LoginModal