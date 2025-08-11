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
            variant={"outline"}
            className={cn("cursor-pointer flex gap-2 ",className)}
            onClick={() => signOut()}
        >
            <LogOut />
            Sign out
        </Button>
    )
}
