import { useEffect, useState } from "react"

// export default function useChessBoardWidth() {
//     const [a,setA] = useState(0)
//     useEffect(() => {
//         const handleResize = () => {
//             const {width} = document.getElementById("chess-board")?.getBoundingClientRect() || {width: 0}
//             setA(width)
//         }
//         handleResize()
//         window.addEventListener("resize", handleResize)

//         return () => {
//             window.removeEventListener("resize", handleResize)
//         }
//     },[])
//     return a
// }

// I think I should disable pieces animation while resizing the window somehow for better perf 

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
