"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function logOutButton() {
    return (
        <Button
            variant={"ghost"}
            className="cursor-pointer flex gap-1 float-"
            onClick={() => signOut()}
        >
            <LogOut />
            <p>Sign out</p>
        </Button>
    )
}
