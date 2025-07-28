"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import {cn} from '@/lib/utils'

export default function logOutButton({
    className
}:{
    className?: string
}) {
    return (
        <Button
            size={'sm'}
            variant={"secondary"}
            className={cn("cursor-pointer flex gap-2 self-end px-2",className)}
            onClick={() => signOut()}
        >
            <LogOut />
            <p>Sign out</p>
        </Button>
    )
}
