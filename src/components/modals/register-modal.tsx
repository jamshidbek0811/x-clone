"use client"

import useRegisterModal from "@/hooks/useRegisterModal"
import useLoginModal from '@/hooks/useLoginModel'
import Modal from "../ui/modal"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from '@hookform/resolvers/zod'
import { registerStep1Schema, registerStep2Schema } from "@/lib/validation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import Button from "../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"

const RegisterModal = () => {
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()

  const onToggle = useCallback(() => {
    loginModal.onOpen()
    registerModal.onClose()
  },[loginModal, registerModal])

  const [step, setStep] = useState(1)
  const [data, setData] = useState({name: "", email: ""})

  const body = step === 1 ? <RegisterStep1 setData={setData} setStep={setStep}/> : <RegisterStep2 data={data}/>

  const footer = <div className="text-neutral-400 text-center mb-4">Already have an account? <span className="text-white cursor-pointer hover:underline" onClick={onToggle}>Sign in</span></div>
  return (
    <Modal body={body} step={step} totalStep={2} footer={footer} isOpen={registerModal.isOpen} onClose={registerModal.onClose} />
  )
}

const RegisterStep1 = ({ setData, setStep }: {
  setData: Dispatch<SetStateAction<{name: string, email: string}>>
  setStep: Dispatch<SetStateAction<number>>
}) => {
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof registerStep1Schema>>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      email: "",
      name: ""
    },
  })

  async function onSubmit(values: z.infer<typeof registerStep1Schema>) {
    try {
        const data = await axios.post(`http://localhost:3000/api/auth/register?step=1`, values)
        if(data.data.succes){
          setData(values)
          setStep(2)
        }else {
          setError(data?.data?.message)
        }
    } catch (error: any) {
        if(error?.response?.data?.message){
          setError(error?.response?.data?.message)
        }else {
          setError("Something went error!")
        }
    }
  }

  const { isSubmitting } = form.formState 

  return (
    <Form {...form}>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
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
      <Button label={"Next"} type="submit" secondary fullWidth large disabled={isSubmitting}/>
      </form>
    </Form>
  )
}

const RegisterStep2 = ({data}: {data: {name: string, email: string}}) => {
  const registerModal = useRegisterModal()
  const [error, setError] = useState("")
  
  const form = useForm<z.infer<typeof registerStep2Schema>>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof registerStep2Schema>) {
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/register?step=2`, {...data, ...values})
      if(response.data.succes){
          signIn("credentials", {
            email: data.email,
            password: values.password
          })
          registerModal.onClose()
      }else {
        setError(response.data.message)
      }
    } catch (error: any) {
        if(error?.response?.data?.message){
          setError(error?.response?.data?.message)
        }else {
          setError("Something went error!")
        }
    }
  }

  const { isSubmitting } = form.formState 
  return (
    <Form {...form}>
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
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
      <Button label={"Register"} type="submit" secondary fullWidth large disabled={isSubmitting}/>
      </form>
    </Form>
  )
}


export default RegisterModal