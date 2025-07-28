'use client'
import { motion, Variants } from "motion/react"
import Image from "next/image"

export default function SetupLoading() {
    const variants:Variants = {
        initial: {
            opacity: 0.1,
            scale : 1
        },
        animate: {
            opacity: 0.5,
            scale : 1.1,
            transition : {
                repeat : Infinity,
                duration : 1,
                repeatType : "reverse"

            }
        },
    }
    return (
        <div className="flex h-full justify-center items-center">
            <motion.div variants={variants} initial="initial" animate="animate">
                <Image
                    alt="loading"
                    src="/images/red-rook.png"
                    width={50}
                    height={50}
                ></Image>
            </motion.div>
        </div>
    )
}
 