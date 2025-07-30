import { useEffect, useState } from "react"

// TODO: I think I should disable pieces animation while resizing the window somehow for better perf 

export default function useChessBoardWidth() {
    const [width, setWidth] = useState(0)
    useEffect(() => {
        const chessBoard = document.getElementById("chess-board")
        if (!chessBoard) return

        const resizeObserver = new ResizeObserver((entries) => {
            const { width } = entries[0].contentRect
            setWidth(width)
        })
        resizeObserver.observe(chessBoard)
        return () => {
            resizeObserver.disconnect()
        }
    }, [])
    return width
}
