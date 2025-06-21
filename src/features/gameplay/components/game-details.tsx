'use client'
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { resign } from "@/redux/slices/game-slice";

export default function GameDetails() {
    const dispatch = useAppDispatch()

    return (
        <div className="bg-gray-300  landscape:min-w-[20%] landscape:lg:w-[30%] landscape:xl:w-[30%]  portrait:h-full  border-l-1 border-black/30 py-4 px-3">
            <Button className="cursor-pointer" onClick={()=>dispatch(resign())}>Resign</Button>
        </div>
    )
}
