import Board from "@/features/gameplay/components/board"

export default function page() {
    return (
        <div className="flex lg:flex-row flex-col w-full flex-1">
            <div className="bg-gray-200 lg:w-[60%] not-lg:h-[60%] flex justify-center items-center">
                <Board />
            </div>
            <div className="bg-gray-300 lg:w-[40%] not-lg:h-[40%] border-l-1  border-black/30"></div>
        </div>
    )
}
