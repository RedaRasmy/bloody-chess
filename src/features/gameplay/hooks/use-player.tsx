import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import {getPlayer} from '../server-actions/player-actions'
import {Player,Guest} from '@/db/types'

export default function usePlayer(){
    const {status,data} = useSession()
    const [player, setPlayer] = useState<Player|null>(null)
    const [guest, setGuest] = useState<Guest|null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'loading') return;

        async function getPlayerOrGuest() {
            if (status === 'authenticated') {
                const playerId = data.user.playerId
                const player = await getPlayer(playerId)

                if (!player) throw new Error("player not exists!");

                setPlayer(player)
                return {
                    isLoading : false,
                    type : 'player',
                    player
                }
            } else {
                // check local storage
                // if exist id fetch existed guest
                // else create new one




            }
            setIsLoading(false)
        }
        getPlayerOrGuest()
 
    }, [status])

    if (isLoading) {
        return {
            isLoading : true,
        }
    } else {
        if (player) {
            return {
                isLoading : false,
                type : 'player',
                player 
            }
        } else {
            return {
                isLoading: false,
                type : 'guest',
                guest
            }
        }
    }

}
