import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import GamesList from "@/features/profile/components/games-list"
import { getHistory } from "@/features/profile/server-actions/get-history"
import { authOptions } from "@/lib/auth-options"
import ProfileHeader from "@/features/profile/components/profile-header"
import { getPlayer } from "@/features/gameplay/server-actions/player-actions"

export default async function page() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect("/auth/signin")
    }
    const { playerId } = session.user
    console.log("session in profile : ", session)

    const history = await getHistory(playerId)
    const player = await getPlayer(playerId)

    return (
        <div className="flex flex-col h-full py-2 px-2 lg:px-5 gap-5 lg:gap-7">
            <ProfileHeader
                username={player.username}
                gamesPlayed={player.gamesPlayed}
                wins={player.wins}
            />
            <GamesList games={history}/>
        </div>
    )
}
