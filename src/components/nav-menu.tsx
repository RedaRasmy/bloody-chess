'use client'
// import Link from "next/link";
import { signIn , signOut , useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LocaleSelect } from "./locale-select";
// import Image from "next/image";

export default function NavMenu() {
    const {data : session} = useSession()
    return (
        <div className="flex gap-4 py-2 px-4 bg-accent justify-between">
            {/* <Image alt="chess-piece" src="public/red-chess-piece.ico" width={20} height={20}/> */}

            <LocaleSelect/>
            {
                session 
                ?
                    <>
                        {/* {session.user?.name}  */}
                        <Button className="cursor-pointer" onClick={()=> signOut()}>Sign out</Button>
                    </>
                :
                    <Button className="cursor-pointer" onClick={()=> signIn()}>Sign in</Button>
            }
        </div>
    )
}