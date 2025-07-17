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
import { useRouter, useSearchParams } from "next/navigation"
import { useState , useEffect } from "react"

const formSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters."),
})

export default function UpdateForm() {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })
    const [success, setSuccess] = useState<string | null>(null)

    const params = useSearchParams()
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    useEffect(() => {
        if (!accessToken || !refreshToken) {
            form.setError("root", { message: "Missing tokens in URL" })
        }
    }, [accessToken, refreshToken, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { newPassword, confirmPassword } = values
        if (newPassword !== confirmPassword) {
            form.setError("confirmPassword", {
                message: "Passwords do not match",
            })
            return
        }

        try {
            const res = await fetch("/api/auth/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: newPassword,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }),
            })
            const result = await res.json()
            if (result.error) {
                form.setError("root", { message: result.error })
            } else {
                setSuccess("Password updated successfully")
                router.push("/auth/signin")
            }
        } catch (error) {
            console.error("Error updating password:", error)
            form.setError("root", { message: "An unexpected error occurred" })
        }
    }

    const errors = form.formState.errors
    const message = errors.root?.message ?? null

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 my-auto place-self-center w-[min(90%,400px)]"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl mb-5 md:mb-10">
                        Update your password
                    </h1>
                    {success ? (
                        <p className="text-green-500 my-2">{success}</p>
                    ) : (
                        <p className="text-red-500 my-2">{message}</p>
                    )}
                </div>
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the new password..."
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Confirm..."
                                    type="password"
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
                        Update
                    </Button>
                </div>
            </form>
        </Form>
    )
}
