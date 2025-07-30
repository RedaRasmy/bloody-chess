import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getPlayer } from "../../gameplay/server-actions/player-actions"
import {
    getGuest,
    createGuest,
} from "../../gameplay/server-actions/guest-actions"
import { Player, Guest } from "@/db/types"
import { useLocalStorage } from "usehooks-ts"
import tryCatch from "@/utils/try-catch"
import { serializeTimestamps } from "@/utils/serialize"

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
    const { status, data, update } = useSession()


    const [player, setPlayer] = useState<Player | null>(null)
    const [guest, setGuest] = useState<Guest | null>(null)
    const [guestId, setGuestId] = useLocalStorage("guest_id", "")

    useEffect(() => {
        if (status === "loading") return

        async function getPlayerOrGuest() {
            try {
                if (status === "authenticated") {
                    const playerId = data.user.playerId

                    if (!playerId) {
                        // Force session update
                        await update()
                        return
                    }
                    const playerData = await getPlayer(playerId)
                    if (!playerData)
                        throw new Error(
                            "Player not exists in DB! id=" + playerId
                        )
                    setPlayer(serializeTimestamps(playerData))
                } else {
                    if (guestId !== "") {
                        // guest_id exists
                        const [guest, error] = await tryCatch(getGuest(guestId))
                        // const guest = await getGuest(guestId)
                        if (error) {
                            // create new one
                            const newGuest = await createGuest()
                            setGuestId(newGuest.id)
                            setGuest(serializeTimestamps(newGuest))
                        } else {
                            setGuest(serializeTimestamps(guest))
                        }
                    } else {
                        // create new one
                        const newGuest = await createGuest()
                        setGuestId(newGuest.id)
                        setGuest(serializeTimestamps(newGuest))
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                // setIsLoading(false)
            }
        }

        getPlayerOrGuest()
    }, [status, data?.user.playerId,update])

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

    return {
        type: "loading",
    }

}
