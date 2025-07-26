"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function UserAvatar({
    className
}:{
    className?: string
}) {
    const { data, status } = useSession()

    console.log('user',data?.user)
    const name = status === "authenticated" ? data.user.username ?? "player" : "guest"


    return (
        <Link href={'/profile'}>
            <Avatar className={cn("border-2 border-gray-300 size-10",className)} >
                <AvatarImage src={"/images/default-avatar.jpg"} />
                <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
        </Link>
    )
}
