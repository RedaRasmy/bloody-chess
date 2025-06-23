
import { Color } from "chess.js"
import React from "react"
import { SmallPiece } from "./small-piece"
import { CapturedPieces as CapturedPiecesTypes } from "../types"

export default function CapturedPieces({
    color,
    capturedPieces,
}: {
    color: Color
    capturedPieces: CapturedPiecesTypes["w"]
}) {

    const pieces = ['p','b','n','r','q']

    // console.log(color , capturedPieces)

    return (
        <div className="flex items-center h-full ">
            {capturedPieces.map((num,index) => (
                <div
                    key={pieces[index]}
                    className="flex h-full -space-x-3 items-center justify-center"
                >
                    {Array.from({length:num},(_,i)=>i).map((_,i) => (
                        <SmallPiece
                            key={i}
                            color={color}
                            type={pieces[index]}
                            className=""
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
