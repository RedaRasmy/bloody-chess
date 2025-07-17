"use client"

import { signIn } from "next-auth/react"
// import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sucess, setSucess] = useState<string | null>(null)
    // const router = useRouter()

    async function handleReset(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                mode: "resetpassword",
            })

            if (result?.error) {
                setError(result.error)
            } else {
                setSucess("Reset password email sent. Please check your inbox.")
                // router.push("/");
            }
        } catch (e) {
            console.error("Error during password reset:", e)
            setError("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleReset}
            className="gap-3 h-full flex flex-col items-center justify-center"
        >
            <h2>Reset your password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {sucess && <p style={{ color: "green" }}>{sucess}</p>}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className={cn("bg-black text-white p-3")}
            >
                Send
            </button>
        </form>
    )
}
