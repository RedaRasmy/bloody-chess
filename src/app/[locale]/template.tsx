"use client"

import { useStorageVersioning } from "@/hooks/use-storage-versioning"
import { ReactNode } from "react"

export default function Template({ children }: { children: ReactNode }) {
    useStorageVersioning()

    return <>{children}</>
}
