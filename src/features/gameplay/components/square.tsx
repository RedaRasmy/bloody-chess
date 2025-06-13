import { cn } from '@/lib/utils';
import type { Color, Square } from 'chess.js';
import React from 'react'
import { getPieceName } from '../utils/getPieceName';
import Image from 'next/image';
import { BoardElement } from '../types';
import { useAppDispatch } from '@/redux/hooks';
import { move, toMove } from '@/redux/slices/game-slice';

export default function Square({name , color,piece,isToMove=false}:{
    name : string
    color : Color,
    piece : BoardElement,
    isToMove?: boolean,
}) {
    const dispatch = useAppDispatch()

    function handleClick() {
        if (isToMove) {
            dispatch(move(name as Square))
        } else {
            if (piece) dispatch(toMove(piece.square))
        }
    }

  return (
    <div 
        className={cn("bg-amber-100 flex justify-center items-center" , {
            'bg-amber-100' : color === 'w',
            'bg-red-700' : color === 'b'
        } )}
        onClick={handleClick}
        >
        {piece  && <Piece type={piece.type} color={piece.color} /> }
        {isToMove && <div className='md:size-7 size-5 bg-gray-500/60 rounded-full z-10 absolute'/>}
        {/* {piece?.square} */}
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
        className="cursor-pointer"
    />
}