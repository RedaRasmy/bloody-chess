import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import GamesList from "@/features/profile/components/games-list"
import LogOutButton from "@/features/profile/components/log-out-button"
import { getHistory } from "@/features/profile/server-actions/get-history"
import { authOptions } from "@/lib/auth-options"

export default async function page() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect("/auth/signin")
    }
    const { username, email , playerId} = session.user
    console.log('session in profile : ',session)
    
    const history = await getHistory(playerId)

    return (
        <div className="flex justify-center items-center h-full py-2">
            <div className="landscape:h-[min(50dvh,500px)] portrait:h-full w-[min(95%,1000px)] gap-3 lg:gap-5 flex portrait:flex-col flex-row">
                <div className="flex gap-3 lg:gap-5 portrait:flex-row bg-gray-100 py-5 rounded-lg flex-col px-3">
                    <div className="flex flex-col gap-2 pl-2 text-nowrap">
                        <p className="font-semibold">username : <span className="font-normal">{username}</span></p>
                        <p className="font-semibold">email : <span className="font-normal">{email}</span></p>
                        <LogOutButton />
                    </div>
                </div>
                <GamesList games={history} />
            </div>
        </div>
    )
}
