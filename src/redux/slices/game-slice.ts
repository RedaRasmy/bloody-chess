import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import {Chess, Square} from 'chess.js'
import { RootState } from "../store"

const initialState = {
    fen : new Chess().fen(),
    allowedSquares : [] as Square[] ,
    activePiece : undefined as Square | undefined,
    playerTurn : true
}

const gameSlice = createSlice({
    name: "game-state",
    initialState,
    reducers: {
        move : (state,{payload:destination}:PayloadAction<Square>) => {
            const pieceToMove = state.activePiece
            if (!pieceToMove) throw new Error("No active piece");
            const chess = new Chess(state.fen)

            chess.move({
                from : pieceToMove,
                to : destination
            })

            state.fen = chess.fen()
            // clear moving states
            state.activePiece = undefined
            state.allowedSquares = []

            // change currentPlayer
            state.playerTurn = !state.playerTurn

        },
        opponentMove : (state,action:PayloadAction<{from:Square,to:Square}>) => {
            const {from,to} = action.payload
            const chess = new Chess(state.fen)
            chess.move({
                from,
                to 
            })
            state.fen = chess.fen()
            // clear moving states
            state.activePiece = undefined
            state.allowedSquares = []

            // change currentPlayer
            state.playerTurn = !state.playerTurn

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


export const {toMove, move,opponentMove} = gameSlice.actions

export default gameSlice.reducer


// Selectors 

export const selectBoard = (state:RootState) => new Chess(state.game.fen).board()
export const selectAllowedSquares = (state:RootState) => state.game.allowedSquares
export const selectFEN = (state:RootState) => state.game.fen
export const selectPlayerTurn = (state:RootState) => state.game.playerTurn

