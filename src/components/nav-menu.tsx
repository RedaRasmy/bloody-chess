"use client"
// import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
// import { LocaleSelect } from "./locale-select"
import Image from "next/image"
import { Link } from "@/i18n/navigation"

export default function NavMenu() {
    const { data: session } = useSession()
    return (
        <div className="flex items-center gap-4 md:py-3 py-2 md:px-4 px-2 bg-accent justify-between">
            <Link className="flex items-center gap-2 " href={"/"}>
                <Image
                    alt="chess-piece"
                    src="/images/red-rook.png"
                    width={40}
                    height={40}
                />
                <h1 className="font-bold md:text-2xl text-xl font-serif tracking-tighter ">
                    Bloody Chess
                </h1>
            </Link>

            <div className="flex gap-2 md:gap-4">
                {/* <LocaleSelect /> */}
                {session ? (
                    <>
                        {/* {session.user?.name}  */}
                        <Button
                            className="cursor-pointer"
                            onClick={() => signOut()}
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
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
                )}
            </div>
        </div>
    )
}
