import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import GamesList from "@/features/profile/components/games-list"
import { getHistory } from "@/features/profile/server-actions/get-history"
import { authOptions } from "@/lib/auth-options"
import ProfileData from "@/features/profile/components/profile-data"

export default async function page() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect("/auth/signin")
    }
    const { playerId } = session.user
    console.log('session in profile : ',session)
    
    const history = await getHistory(playerId)

    return (
        <div className="flex justify-center items-center h-full py-2">
            <div className="landscape:h-[min(50dvh,500px)] portrait:h-full w-[min(95%,1000px)] gap-3 lg:gap-5 flex portrait:flex-col flex-row">
                <ProfileData user={session.user}/>
                <GamesList games={history} />
            </div>
        </div>
    )
}
