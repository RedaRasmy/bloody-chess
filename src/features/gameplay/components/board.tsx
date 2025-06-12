import Image from "next/image"
import { getPieceName } from "../utils/getPieceName"
import { Square } from "../types"

export default function Board({state}:{
    state : string
}) {
    const squares : Square[] = Array.from({length:64},(_,i)=> {
        const row = Math.floor(i/8)
        const col = i % 8
        return {
            index : i,
            color : (row+col) % 2 === 0 ? 'white' : 'black',
            content : 'b',
            name : 'f3'
        }
    })

  return (
    <div className="lg:w-130 w-90 md:portrait:w-140 not-sm:m-5 relative after:[content:''] after:block after:pt-[100%] ">

        <div className="absolute w-full h-full bg-black grid grid-cols-8 grid-rows-8">
            {
                squares.map(sq => {
                    if (sq.color == 'white') {
                        return <div key={sq.index} className="bg-amber-100 flex justify-center items-center">
                            {sq.content && <Piece char={sq.content} /> }
                        </div>
                    } else {
                        return <div key={sq.index} className="bg-red-700 flex justify-center items-center">
                            {sq.content && <Piece char={sq.content} /> }
                        </div>
                    }
                })
            }
        </div>
    </div>
  )
}



function Piece({char}:{
    char : string // example : p , P , N , n , ...
}) {
    /// black is uppercase , white is lowercase
    const color = char.toUpperCase() === char ? "black" : "white"
    const name = getPieceName(char)

    return <Image alt={char} width={55} height={55} src={`/images/chess-pieces/${color}-${name}.png`} />
}