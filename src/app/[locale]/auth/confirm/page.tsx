"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { EmailOtpType } from "@supabase/supabase-js"
import { signIn } from "next-auth/react"

export default function ConfirmPage() {
    const router = useRouter()

    const params = useSearchParams()
    const token_hash = params.get("token_hash")
    const type = params.get("type")

    const [status, setStatus] = useState("confirming")

    useEffect(() => {
        const confirmEmail = async () => {
            if (!token_hash || !type) return


            const { data, error } = await supabase.auth.verifyOtp({
                token_hash,
                type : type as EmailOtpType,
            })

            if (error || !data.user) {
                setStatus("error")
                console.error("Error confirming email:", error)
            } else {
                setStatus("success")

                // Auto-signin with NextAuth using the confirmed email
                const result = await signIn("credentials", {
                    email: data.user.email,
                    // You might need to handle this differently based on your auth setup
                    // redirect: false,
                })

                if (result?.ok) {
                    router.push("/") // or wherever you want to redirect
                } else {
                    // Fallback: redirect to signin with success message
                    router.push(
                        "/auth/signin?message=Email confirmed! Please sign in."
                    )
                }
            }
        }

        confirmEmail()
    }, [token_hash, type, router])

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            {status === "confirming" && (
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        Confirming Email...
                    </h2>
                    <p>Please wait while we confirm your email address.</p>
                </div>
            )}

            {status === "success" && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-green-600">
                        Email Confirmed!
                    </h2>
                    <p>Your email has been confirmed. Signing you in...</p>
                </div>
            )}

            {status === "error" && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-red-600">
                        Confirmation Failed
                    </h2>
                    <p>
                        There was an error confirming your email. Please try
                        again.
                    </p>
                </div>
            )}
        </div>
    )
}
