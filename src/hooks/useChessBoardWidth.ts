import { useEffect, useState } from "react"


export default function useChessBoardWidth() {
    const [a,setA] = useState(0)
    useEffect(() => {
        const handleResize = () => {
            const {width} = document.getElementById("chess-board")?.getBoundingClientRect() || {width: 0}
            setA(width)
        }
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    })
    return a
}