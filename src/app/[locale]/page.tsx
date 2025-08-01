import BotOptionsDialog from "@/features/bot/components/bot-options-dialog"
import MultiplayerOptionsDialog from "@/features/multiplayer/components/multiplayer-options-dialog"
import SettingsDialog from "@/features/settings/components/settings-dialog"

export default function Home() {
    return (
        <div className="flex h-full justify-center items-center bg-gray-200 w-full">
            <div className="flex flex-col gap-2 lg:gap-3 w-[min(90%,400px)]">
                <MultiplayerOptionsDialog />
                <BotOptionsDialog />
                <SettingsDialog/>
            </div>
        </div>
    )
}
