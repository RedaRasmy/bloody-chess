import BotOptionsDialog from "@/features/gameplay/components/bot-options-dialog"
import MultiplayerOptionsDialog from "@/features/gameplay/components/multiplayer-options-dialog"

export default function Home() {
    return (
        <div className="flex h-full justify-center items-center bg-gray-200">
            <div className="flex flex-col gap-2">
                <MultiplayerOptionsDialog/>
                <BotOptionsDialog/>
            </div>
        </div>
    )
}
