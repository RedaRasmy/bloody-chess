import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import {Chess, Square} from 'chess.js'
import { RootState } from "../store"

const initialState = {
    fen : new Chess().fen(),
    allowedSquares : [] as Square[] ,
    activePiece : undefined as Square | undefined
}

const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
        move : (state,{payload:destination}:PayloadAction<Square>) => {
            const pieceToMove = state.activePiece
            if (!pieceToMove) return;
            const chess = new Chess(state.fen)

            chess.move({
                from : pieceToMove,
                to : destination
            })

            state.fen = chess.fen()
            // clear moving states
            state.activePiece = undefined
            state.allowedSquares = []

        },
        toMove : (state,{payload:pieceSquare}:PayloadAction<Square>) => {
            const chess = new Chess(state.fen)
            state.allowedSquares = chess.moves({
                square : pieceSquare , verbose: true
            }).map(m=>m.to)

            console.log(state.allowedSquares)
            state.activePiece = pieceSquare
        }
    },
})


export const {toMove, move} = gameSlice.actions

export default gameSlice.reducer


// Selectors 

export const selectBoard = (state:RootState) => new Chess(state.game.fen).board()
export const selectAllowedSquares = (state:RootState) => state.game.allowedSquares

