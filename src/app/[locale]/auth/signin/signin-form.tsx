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
import { ClientSafeProvider, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Github } from "lucide-react"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters."),
})

export default function SignInForm({
    providers,
}: {
    providers: ClientSafeProvider[]
}) {
    const router = useRouter()
    const params = useSearchParams()
    const message = params.get("message")



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { email, password } = values
        try {
            const result = await signIn("credentials", {
                email,
                password,
                mode: "signin",
                redirect: false,
            })

            if (result?.error) {
                form.setError("root", { message: result.error })
            } else {
                router.push("/")
            }
        } catch (err) {
            console.error(err)
            form.setError("root", { message: "Unexpected error occurred 🤕" })
        }
    }

    const errors = form.formState.errors
    const error = errors.root?.message ?? null

    return (
        <div className="flex flex-col w-[min(90%,400px)] my-auto place-self-center gap-6 ">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl mb-5 md:mb-10">
                            Login to your account
                        </h1>
                        <p className="text-green-500 my-2">{message}</p>
                        <p className="text-red-500 my-2">{error}</p>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your password"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    <Link href={"/auth/reset"}>
                                        Forget password?
                                    </Link>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row-reverse mt-6">
                        <Button
                            type="submit"
                            // size='lg'
                            className="cursor-pointer"
                            disabled={form.formState.isSubmitting}
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </Form>
            { providers.length > 0 && <hr /> }
            <>
                {providers
                    .map((provider) => (
                        <div key={provider.name} className='w-full'>
                            <Button
                                size={'lg'}
                                className="cursor-pointer mb-2 w-full py-5"
                                onClick={() => signIn(provider.id)}
                            >
                                <Github className="mr-1 size-6" />
                                Sign in with {provider.name}
                            </Button>
                        </div>
                    ))}
            </>
        </div>
    )
}
