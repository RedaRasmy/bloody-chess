import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getPlayer } from "../server-actions/player-actions"
import { getGuest, createGuest } from "../server-actions/guest-actions"
import { Player, Guest } from "@/db/types"
import { useLocalStorage } from "usehooks-ts"

type Loading = {
    type: "loading"
}
type PlayerResult = {
    type: "player"
    data: Player
}
type GuestResult = {
    type: "guest"
    data: Guest
}
type Result = Loading | PlayerResult | GuestResult

export default function usePlayer(): Result {
    const { status, data } = useSession()
    const [player, setPlayer] = useState<Player | null>(null)
    const [guest, setGuest] = useState<Guest | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [guestId, setGuestId] = useLocalStorage("guest_id", "")

    useEffect(() => {
        if (status === "loading") return

        async function getPlayerOrGuest() {
            try {
                if (status === "authenticated") {
                    const playerId = data.user.playerId // or playerId if you added it

                    const playerData = await getPlayer(playerId)
                    if (!playerData)
                        throw new Error(
                            "Player not exists in DB! id=" + playerId
                        )

                    setPlayer(playerData)
                    console.log("player : ", playerData)
                } else {
                    if (guestId !== "") {
                        // guest_id exists
                        const guest = await getGuest(guestId)
                        if (!guest)
                            // maybe i should created again anyway with the same id
                            // or update the id in localstorage
                            throw new Error(
                                "Guest not exists in DB! id=" + guestId
                            )
                        setGuest(guest)
                        console.log("guest : ", guest)
                    } else {
                        // create new one
                        const newGuest = await createGuest()
                        setGuestId(newGuest.id)
                        setGuest(newGuest)
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        getPlayerOrGuest()
    }, [status])

    if (isLoading) {
        return {
            type: "loading",
        }
    }

    if (player) {
        return {
            type: "player",
            data: player,
        }
    }

    if (guest) {
        return {
            type: "guest",
            data: guest,
        }
    }

    throw new Error("usePlayer: no player or guest found!")
}
