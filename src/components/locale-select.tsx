import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { usePathname, useRouter } from "@/i18n/navigation"
// import { useParams } from "next/navigation"
import { useTransition } from "react"

export function LocaleSelect() {

    const router = useRouter()
    const [,startTransition] = useTransition()
    const pathname = usePathname()
    // const params = useParams()

    function handleChange(value : string) {
        startTransition(()=>{
            router.replace(
                {pathname},
                {locale:value}
            )
        })
    }
    return (
        <Select
            onValueChange={handleChange}
        >
            <SelectTrigger className="sm:w-[180px] w-[120px] ">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
        </Select>
    )
}