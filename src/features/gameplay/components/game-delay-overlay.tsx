import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"

export default function GameDelayOverlay({
    gameStartedAt,
}: {
    gameStartedAt: number | null
}) {
    function getDelay() {
        return gameStartedAt ? Math.max(0, gameStartedAt - Date.now() - 300 ) : 0
    }
    const [timeLeftMs, setTimeLeftMs] = useState(getDelay())
    const [isVisible, setIsVisible] = useState(getDelay() > 0)

    // Sync with prop changes
    useEffect(() => {
        const delayMs = getDelay()
        console.log("delay : ", delayMs)

        if (delayMs > 0) {
            setTimeLeftMs(delayMs)
            setIsVisible(true)
        }
    }, [gameStartedAt])

    useEffect(() => {
        if (!isVisible) return

        const interval = setInterval(() => {
            setTimeLeftMs((prev) => {
                if (prev <= 100) {
                    setIsVisible(false)
                    return 0
                }
                return prev - 100
            })
        }, 100)

        return () => clearInterval(interval)
    }, [isVisible])

    const displaySeconds = Math.ceil(timeLeftMs / 1000)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.3,
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-xs"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white rounded-2xl p-8 text-center shadow-2xl"
                    >
                        {/* Animated Chess Icon */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="text-6xl mb-4"
                        >
                            ♚
                        </motion.div>

                        {/* Countdown */}
                        <motion.div
                            key={displaySeconds} // Re-trigger animation on change
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-bold text-gray-800 mb-2"
                        >
                            {displaySeconds}
                        </motion.div>

                        <motion.p
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-gray-600"
                        >
                            Game starting soon...
                        </motion.p>

                        {/* Progress Bar */}
                        <div className="w-32 h-1 bg-gray-200 rounded-full mt-4 mx-auto overflow-hidden">
                            <motion.div
                                animate={{
                                    width: `${(timeLeftMs / 3000) * 100}%`,
                                }}
                                transition={{ duration: 0.1, ease: "linear" }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
