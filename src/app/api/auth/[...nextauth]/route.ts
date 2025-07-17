import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/utils/supabase/client"
import tryCatch from "@/utils/try-catch"
// const supabase = createClient()

interface User {
    id: string
    email: string
    name: string
}

interface Session {
    user: {
        id: string
        email: string
    }
    expires: string
}

const authHandlers = {
    async handleSignup(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXTAUTH_URL}`,
            },
        })

        if (error) {
            console.error("[AUTH] Signup error:", error)
            throw new Error(error.message)
        }

        if (!data.user?.id) {
            throw new Error(
                "Signup successful. Please check your email for confirmation."
            )
        }

        return data.user
    },

    async handleSignIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error("[AUTH] Signin error:", error)
            throw new Error(error.message)
        }

        if (!data.user?.id) {
            throw new Error("Invalid credentials")
        }

        return data.user
    },

    async handleResetPassword(email: string) {
        //
    },
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password",
                },
                mode: {
                    label: "Mode",
                    type: "text",
                    placeholder: "signin, signup, or resetpassword",
                },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials) throw new Error("No credentials")
                if (credentials.mode === "resetpassword") {
                    try {
                        const { data, error } =
                            await supabase.auth.resetPasswordForEmail(
                                credentials.email,
                                {
                                    redirectTo: `${process.env.NEXTAUTH_URL}/auth/update-password`,
                                }
                            )

                        if (error) throw error

                        // Return null because we don't want to sign in the user yet
                        return null
                    } catch (error) {
                        console.error("Reset password error:", error)
                        throw new Error("Failed to send reset password email")
                    }
                }
                
                try {
                    const { email, password, mode } = credentials
                    const lowerMode = mode?.toLowerCase()

                    if (!email && !password) {
                        throw new Error(
                            "Password is required for signin or signup"
                        )
                    }
                    const user =
                        lowerMode === "signup"
                            ? await authHandlers.handleSignup(email, password)
                            : await authHandlers.handleSignIn(email, password)

                    return {
                        id: user.id,
                        email: user.email ?? email,
                        name: user.email ?? email,
                    }
                } catch (error) {
                    console.error("[AUTH] Authorization error:", {
                        error,
                        email: credentials?.email,
                        // mode: credentials?.mode,
                        timestamp: new Date().toISOString(),
                    })
                    throw error
                }
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    pages: {
        signIn: "/auth/signin",
        error: "auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id
                token.email = user.email
                token.lastUpdated = new Date().toISOString()
            }
            return token
        },
        async session({ session, token }): Promise<Session> {
            return {
                ...session,
                user: {
                    id: token.userId as string,
                    email: token.email as string,
                },
            }
        },
    },
    events: {
        async signIn({ user }) {
            console.log("[AUTH] Successful sign-in:", {
                userId: user.id,
                email: user.email,
                timestamp: new Date().toISOString(),
            })
        },
        async signOut({ token }) {
            if (token?.userId) {
                await supabase.auth.signOut()
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
