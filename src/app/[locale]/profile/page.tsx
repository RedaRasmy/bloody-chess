import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import UserAvatar from "@/features/profile/components/user-avatar"
import GamesList from "@/features/profile/components/games-list"
import LogOutButton from "@/features/profile/components/log-out-button"

export default async function page() {
    const session = await getServerSession()
    if (!session || !session.user) {
        redirect("/auth/signin")
    }
    const { username, email } = session.user
    return (
        <div className="flex justify-center items-center h-full">
            <div className="h-[min(50dvh,500px)] w-[min(95%,1000px)] gap-3 flex portrait:felx-col flex-row">
                <div className="flex gap-3 lg:gap-5 border-1 border-black portrait:flex-row flex-col ">
                    <UserAvatar className="size-20"/>
                    <div className="flex flex-col gap-2 pl-2">
                        <p>username : {username}</p>
                        <p>email : {email}</p>
                        <LogOutButton />
                    </div>
                </div>
                <GamesList />
            </div>
        </div>
    )
}
