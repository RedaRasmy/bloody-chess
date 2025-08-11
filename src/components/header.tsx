"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"
import Link from "next/link"

export default function Header() {
    const { status } = useSession()
    return (
        <div className="min-h-10 flex items-center pl-2 pr-4 justify-between sticky py-3">
            <SidebarTrigger />
            <div className="flex gap-2 md:gap-4">
                {status === "authenticated" ? (
                    <p className="text-muted-foreground">
                        Welcome back, Player
                    </p>
                ) : (
                    status === "unauthenticated" && (
                        <div className="flex gap-2">
                            <Button
                                className="cursor-pointer"
                                onClick={() => signIn()}
                            >
                                Sign in
                            </Button>
                            <Button asChild>
                                <Link href={"/auth/register"}>Register</Link>
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
