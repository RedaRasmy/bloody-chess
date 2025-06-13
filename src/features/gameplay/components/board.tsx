'use client'
import Image from "next/image"
import { getPieceName } from "../utils/getPieceName"
import { useAppSelector } from "@/redux/hooks"
import { selectBoard } from "@/redux/slices/game-slice"

export default function Board() {

    const board = useAppSelector(selectBoard).flat()

  return (
    <div className="lg:w-130 w-90 md:portrait:w-140 not-sm:m-5 relative after:[content:''] after:block after:pt-[100%] ">

        <div className="absolute w-full h-full bg-black grid grid-cols-8 grid-rows-8">
            {
                board.map((p,i) => {
                    const squareColor = getSquareColor(i)
                   if (squareColor == 'w') {
                        return <div key={i} className="bg-amber-100 flex justify-center items-center">
                            {p  && <Piece type={p.type} color={p.color} /> }
                        </div>
                    } else {
                        return <div key={i} className="bg-red-700 flex justify-center items-center">
                            {p && <Piece type={p.type} color={p.color} /> }
                        </div>
                    }
                })
            }
        </div>
    </div>
  )
}

function Piece({type,color}:{
    type : string // example : p , n , ...
    color : 'w' | 'b'
}) {
    /// black is uppercase , white is lowercase
    const colorName = color == 'b' ? "black" : "white"
    const name = getPieceName(type)

    return <Image 
        alt={type} width={55} height={55} src={`/images/chess-pieces/${colorName}-${name}.png`}
        className="cursor-grab"
    />
}

function getSquareColor(index:number): "w" | 'b' {
    const row = Math.floor(index/8)
    const col = index % 8

    return (row+col) % 2 === 0 ? 'w' : 'b'
}