import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/utils/supabase/client"
// import tryCatch from "@/utils/try-catch"
import { db } from "@/db/drizzle"
import { players } from "@/db/schema"

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

    // async handleResetPassword(email: string) {
    //     //
    // },
}

export const authOptions: NextAuthOptions = {
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
            async authorize(credentials) {
                if (!credentials) throw new Error("No credentials")
                const { email, password, mode } = credentials

                if (credentials.mode === "resetpassword") {
                    try {
                        const { error } =
                            await supabase.auth.resetPasswordForEmail(email, {
                                redirectTo: `${process.env.NEXTAUTH_URL}/auth/update-password`,
                            })

                        if (error) throw error

                        // Return null because we don't want to sign in the user yet
                        return null
                    } catch (error) {
                        console.error("Reset password error:", error)
                        throw new Error("Failed to send reset password email")
                    }
                }

                try {
                    const lowerMode = mode.toLowerCase()

                    if (!email || !password) {
                        throw new Error(
                            "Email and Password are required for signin or signup"
                        )
                    }
                    const user =
                        lowerMode === "signup"
                            ? await authHandlers.handleSignup(email, password)
                            : await authHandlers.handleSignIn(email, password)

                    if (user.email_confirmed_at) {
                        // sign in only if email is confirmed
                        return {
                            id: user.id,
                            email: email,
                        }
                    } else return null
                } catch (error) {
                    console.error("[AUTH] Authorization error:", {
                        error,
                        email: credentials?.email,
                        mode: credentials?.mode,
                        timestamp: new Date().toISOString(),
                    })
                    throw error
                }
            },
        }), /// for auto sign in 
        CredentialsProvider({
            id: "email-confirmation",
            name: "Email Confirmation",
            credentials: {
                userId: { label: "User ID", type: "text" },
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                if (!credentials?.userId || !credentials?.email) {
                    return null
                }

                // Verify this is a legitimate confirmation by checking Supabase
                const { data, error } = await supabase.auth.getUser()

                if (
                    error ||
                    !data.user ||
                    data.user.id !== credentials.userId
                ) {
                    return null
                }

                return {
                    id: credentials.userId,
                    email: credentials.email,
                }
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        // async signIn({ user }) {
        //     // Only create player on first signup, not every signin
        //     if (user.email) {
        //         // Check if player already exists
        //         const existingPlayer = await db.query.players.findFirst({
        //             where: (players, { eq }) => eq(players.userId, user.id),
        //         })

        //         if (!existingPlayer) {
        //             // Create player profile
        //             await db.insert(players).values({
        //                 userId: user.id,
        //                 username:
        //                     user.name || user.email.split("@")[0] + Math.random()*10000,
        //                 elo: 500,
        //                 gamesPlayed: 0,
        //                 wins: 0,
        //                 losses: 0,
        //                 draws: 0,
        //             })
        //         } else {
        //         }
        //     }
        //     return true
        // },
        async jwt({ token, user }) {
            if (user && user.id && user.email) {
                token.userId = user.id
                token.email = user.email
                token.lastUpdated = new Date().toISOString()

                const existingPlayer = await db.query.players.findFirst({
                    where: (players, { eq }) => eq(players.userId, user.id),
                })

                if (!existingPlayer) {
                    // Create player profile
                    const result = await db
                        .insert(players)
                        .values({
                            userId: user.id,
                            username: user.name || user.email.split("@")[0],
                            elo: 500,
                            gamesPlayed: 0,
                            wins: 0,
                            losses: 0,
                            draws: 0,
                        })
                        .returning()
                    const player = result[0]
                    token.playerId = player.id
                    token.username = player.username
                } else {
                    token.playerId = existingPlayer.id
                    token.username = existingPlayer.username
                }
            }
            return token
        },
        async session({ session, token }) {
            console.log("session callback/ token : ", token)
            session.user.id = token.userId
            session.user.email = token.email
            session.user.playerId = token.playerId
            session.user.username = token.username

            return session
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
    debug: process.env.NODE_ENV === "development",
}
