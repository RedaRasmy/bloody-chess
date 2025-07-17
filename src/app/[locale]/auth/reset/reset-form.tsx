"use client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import {useState} from 'react'

const formSchema = z.object({
    email: z.string().email(),
})

export default function ResetForm() {
    const [success, setSuccess] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { email } = values
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                mode: "resetpassword",
            })

            if (result?.error) {
                form.setError('root',{
                    message : result.error
                })

            } else {
                setSuccess("Reset password email sent. Please check your inbox.")
            }
        } catch (e) {
            console.error("Error during password reset:", e)
            form.setError('root',{message:"An unexpected error occurred"})
        }
    }

    const errors = form.formState.errors
    const error =
        errors.root?.message ??
        null

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 my-auto place-self-center w-[min(90%,400px)]"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl mb-5 md:mb-10">Reset your password</h1>
                    {success 
                    ? <p className="text-green-500 my-2">{success}</p>
                    : <p className="text-red-500 my-2">{error}</p>
                    }
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row-reverse mt-6">
                    <Button
                        type="submit"
                        className="cursor-pointer"
                        disabled={form.formState.isSubmitting}
                    >
                        Send
                    </Button>
                </div>
            </form>
        </Form>
    )
}