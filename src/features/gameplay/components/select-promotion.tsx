import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { Piece } from "./piece"
import { Color } from "chess.js"

export default function SelectPromotion({
    color,
    onChange,
    open,
    onOpenChange
}: {
    color: Color
    onChange: (value: string) => void
    open: boolean,
    onOpenChange : (open:boolean) => void
}) {
    return (
        <Select
            open={open}
            onValueChange={onChange}
            onOpenChange={onOpenChange}
        >
            <SelectTrigger className="opacity-0 absolute pointer-events-none "></SelectTrigger>
            <SelectContent className="min-w-0 sm:w-20 w-13">
                <SelectItem value="q" className="flex items-center justify-center px-0">
                    <Piece color={color} type="q" />
                </SelectItem>
                <SelectItem value="n" className="flex items-center justify-center px-0">
                    <Piece color={color} type="n" />
                </SelectItem>
                <SelectItem value="r" className="flex items-center justify-center px-0">
                    <Piece color={color} type="r" />
                </SelectItem>
                <SelectItem value="b" className="flex items-center justify-center px-0">
                    <Piece color={color} type="b" />
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
