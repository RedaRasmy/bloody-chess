"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"

export default function LogOutButton({
    className,
    variant,
    size,
    onlyIcon = false,
}: {
    className?: string
    onlyIcon?: boolean
} & VariantProps<typeof buttonVariants>) {
    return (
        <Button
            variant={onlyIcon ? "outline" : variant}
            size={onlyIcon ? "icon" : size}
            className={cn("cursor-pointer flex gap-2 items-center justify-center", className)}
            onClick={() => signOut()}
        >
            <>
                <LogOut size={16}/>
                {!onlyIcon && "Sign out"}
            </>
        </Button>
    )
}
