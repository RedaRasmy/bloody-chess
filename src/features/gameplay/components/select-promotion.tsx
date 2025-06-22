
import { Piece } from "./piece"
import { Color } from "chess.js"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { RefObject, useRef } from "react"

export default function SelectPromotion({
    color,
    onChange,
    open,
    onClickOutside,
}: {
    color: Color
    onChange: (value: string) => void
    open: boolean
    onClickOutside: () => void
}) {

    const ref = useRef<HTMLDivElement>(null)
    useOnClickOutside(ref as RefObject<HTMLElement> ,onClickOutside)

    if (open) return (
        // <Select
        //     open={open}
        //     onValueChange={onChange}
        //     onOpenChange={onOpenChange}
        // >
        //     <SelectTrigger className="opacity-0  pointer-events-none "></SelectTrigger>
        //     <SelectContent className="absolute -translate-y-1/2 top-1/2 left-1/2 w-30 h-50 flex flex-col">
        //         <SelectItem value="q" className="flex items-center justify-center px-0">
        //             <Piece color={color} type="q" />
        //         </SelectItem>
        //         <SelectItem value="n" className="flex items-center justify-center px-0">
        //             <Piece color={color} type="n" />
        //         </SelectItem>
        //         <SelectItem value="r" className="flex items-center justify-center px-0">
        //             <Piece color={color} type="r" />
        //         </SelectItem>
        //         <SelectItem value="b" className="flex items-center justify-center px-0">
        //             <Piece color={color} type="b" />
        //         </SelectItem>
        //     </SelectContent>
        // </Select>
        <div ref={ref} className="grid grid-cols-2 p-2 grid-rows-2 w-1/2 gap-2 aspect-square absolute -translate-y-1/2 top-1/2 z-50 left-1/2 -translate-x-1/2 bg-gray-100 rounded-2xl">
            <div className="relative bg-gray-200 hover:bg-gray-300 rounded-lg" onClick={()=>onChange('q')} >
                <Piece color={color} type="q" />
            </div>
            <div className="relative bg-gray-200 hover:bg-gray-300 rounded-lg" onClick={()=>onChange('n')} >
                <Piece color={color} type="n" />
            </div>
            <div className="relative bg-gray-200 hover:bg-gray-300 rounded-lg" onClick={()=>onChange('r')}>
                <Piece color={color} type="r" />
            </div>
            <div className="relative bg-gray-200 hover:bg-gray-300 rounded-lg" onClick={()=>onChange('b')}>
                <Piece color={color} type="b" />
            </div>
        </div>
    )
}
