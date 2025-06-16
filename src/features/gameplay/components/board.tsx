'use client'
import Square  from "./square"
import { useAppSelector } from "@/redux/hooks"
import { selectAllowedSquares, selectBoard, selectPlayerColor } from "@/redux/slices/game-slice"
import { indexToSquare } from "../utils/index-to-square"
import { cn } from "@/lib/utils"

export default function Board() {

    const board = useAppSelector(selectBoard).flat()
    const allowedSquares = useAppSelector(selectAllowedSquares)
    const playerColor = useAppSelector(selectPlayerColor)

  return (
    <div className="lg:w-130 w-90 md:portrait:w-140 not-sm:m-5 relative after:[content:''] after:block after:pt-[100%] ">

        <div className={cn("absolute w-full h-full bg-black grid grid-cols-8 grid-rows-8",{
            'rotate-180' : playerColor === 'b'
        })}>
            {
                board.map((p,i) => {
                    const squareColor = getSquareColor(i)
                   return <Square name={indexToSquare(i)} color={squareColor} piece={p} key={i} isToMove={allowedSquares.includes(indexToSquare(i))} />
                })
            }
        </div>
    </div>
  )
}



function getSquareColor(index:number): "w" | 'b' {
    const row = Math.floor(index/8)
    const col = index % 8

    return (row+col) % 2 === 0 ? 'w' : 'b'
}