'use client'
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { resign } from "@/redux/slices/game-slice";

export default function GameDetails() {
    const dispatch = useAppDispatch()

    return (
        <div className="bg-gray-300 lg:w-[40%] not-lg:h-[40%] border-l-1  border-black/30 py-4 px-3">
            <Button className="cursor-pointer" onClick={()=>dispatch(resign())}>Resign</Button>
        </div>
    )
}
