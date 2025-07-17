"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sucess, setSucess] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const hash = window.location.hash
            const params = new URLSearchParams(hash.substring(1))
            const token = params.get("access_token")
            const rToken = params.get("refresh_token")

            if (token && rToken) {
                setAccessToken(token)
                setRefreshToken(rToken)
            } else {
                setError("Missing tokens in URL.")
            }
        }
    }, [])

    async function handleUpdatePassword(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()
        setIsSubmitting(true)

        // Validation
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            setIsSubmitting(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            setIsSubmitting(false)
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
                setError(result.error)
            } else {
                setSucess("Password updated successfully")
                setError(null)
                router.push("/auth/signin")
            }
        } catch (error) {
            console.error("Error updating password:", error)
            setError('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

        return (
            <form
                onSubmit={handleUpdatePassword}
                className="gap-3 h-full flex flex-col items-center justify-center"
            >
                <h2>Update your password</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {sucess && <p style={{ color: "green" }}>{sucess}</p>}
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={"bg-black text-white p-3"}
                >
                    Submit
                </button>
            </form>
        )
}
