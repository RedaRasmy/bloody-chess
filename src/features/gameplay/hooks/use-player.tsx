import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getPlayer } from "../server-actions/player-actions"
import { getGuest,createGuest } from "../server-actions/guest-actions"
import { Player, Guest } from "@/db/types"
import { useLocalStorage } from 'usehooks-ts'

export default function usePlayer() {
    const { status, data } = useSession()
    const [player, setPlayer] = useState<Player | null>(null)
    const [guest, setGuest] = useState<Guest | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === "loading") return;

        async function getPlayerOrGuest() {
            try {
                if (status === "authenticated") {
                    const playerId = data.user.playerId // or playerId if you added it

                    const playerData = await getPlayer(playerId)
                    if (!playerData) throw new Error("Player not exists in DB! id="+playerId)

                    setPlayer(playerData)
                } else {
                    const [id, setId] = useLocalStorage('guest_id','none')
                    if (id!=='none') { // guest exists
                        const guest = await getGuest(id)
                        if (!guest) throw new Error("Guest not exists in DB! id="+id);
                        setGuest(guest)
                    } else {
                        // create new one
                        const newGuest = await createGuest()
                        setId(newGuest.id)
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
    }, [status, data])

    if (isLoading) {
        return {
            isLoading: true,
        }
    }

    if (player) {
        return {
            isLoading: false,
            type: "player",
            player,
        }
    }

    return {
        isLoading: false,
        type: "guest",
        guest,
    }
}
