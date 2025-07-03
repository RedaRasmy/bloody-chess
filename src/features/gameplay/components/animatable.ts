// import { useDraggable } from "@dnd-kit/core"
// import { cn } from "@/lib/utils"
// import { CSS } from "@dnd-kit/utilities"
// import { BoardElement } from "../types"
// import { ReactNode, useEffect, useState } from "react"
// import { squareToCoords } from "../utils/square-to-coords"
// import { Square } from "chess.js"
// import { motion } from "motion/react"

// export default function Animatable({
//     square,
//     data,
//     children,
//     className,
//     boardWidth,
// }: {
//     data: Exclude<BoardElement, null> | undefined
//     children: ReactNode
//     className?: string
//     square: Square
//     boardWidth: number
// }) {
//     console.log("animatable compo runs !")

//     const [x, y] = squareToCoords(square)

//     const [justDropped, setJustDropped] = useState(false)

//     // useEffect(() => {
//     //     if (!isDragging && justDropped) {
//     //         // Reset after a brief moment
//     //         const timer = setTimeout(() => setJustDropped(false), 50)
//     //         return () => clearTimeout(timer)
//     //     }
//     //     if (isDragging) {
//     //         setJustDropped(true)
//     //     }
//     // }, [isDragging, justDropped])

//     return (
//         <motion.div
//             // Outer wrapper: handles layout and framer positioning
//             initial={{
//                 x: x * (boardWidth / 8),
//                 y: y * (boardWidth / 8),
//             }}
//             animate={{
//                 x: x * (boardWidth / 8),
//                 y: y * (boardWidth / 8),
//             }}
//             layout
//             transition={{
//                 duration: justDropped ? 0 : 0.2, // Skip animation if just dropped
//             }}
//             className="absolute"
//         >
//             {children}
//         </motion.div>
//     )
// }
