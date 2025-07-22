"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    changeTimer,
    selectMultiplayerOptions,
} from "@/redux/slices/game-options"
import SelectTimer from "./select-timer"
import { TIMER_OPTIONS } from "../utils/constantes"
import { useRouter } from "next/navigation"
import useGameSearching from "../hooks/use-game-searching"
import { getGuest } from "../server-actions/guest-actions"
import { setup } from "@/redux/slices/multiplayer/multiplayer-slice"
import { getPlayer } from "../server-actions/player-actions"

export default function MultiplayerOptionsDialog() {
    const MULTIPLAYER_PATH = "play/multiplayer/"
    const router = useRouter()
    const { timer } = useAppSelector(selectMultiplayerOptions)
    const dispatch = useAppDispatch()

    const { searchTimer, isSearching, startSearch, cancelSearch } =
        useGameSearching({
            timerOption: timer,
            onGameFound: async (game, { data }) => {
                router.push(MULTIPLAYER_PATH + game.id)
                // setup the game
                console.log('setuping the full game...')
                console.log('the game getting from onGameFound : ',game)
                console.log("isForGuests = " +game.isForGuests)
                const playerId = data.id
                if ("displayName" in data) { // if guest
                    console.log("fetching guests ...")
                    const white = playerId === game.whiteId ? data : await getGuest(game.whiteId)
                    const black = playerId === game.blackId ? data : await getGuest(game.blackId)
                    dispatch(
                        setup({
                            game: {
                                ...game,
                                isForGuests: true,
                                white,
                                black,
                                moves : [], // no moves yet
                            },
                            playerId: data.id,
                        })
                    )
                } else {
                    console.log("fetching players ...")
                    const white = playerId === game.whiteId ? data : await getPlayer(game.whiteId)
                    const black = playerId === game.whiteId ? data : await getPlayer(game.blackId)
                    dispatch(
                        setup({
                            game: {
                                ...game,
                                isForGuests: false,
                                white,
                                black,
                                moves : [], // no moves yet
                            },
                            playerId: data.id,
                        })
                    )
                }
            },
        })

    return (
        <Dialog onOpenChange={cancelSearch}>
            <DialogTrigger asChild>
                <Button className="lg:w-sm w-50 py-6 cursor-pointer">
                    Play Online
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Multiplayer game setup</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <SelectTimer
                        required
                        options={[...TIMER_OPTIONS]}
                        value={timer}
                        onChange={(op) => dispatch(changeTimer(op))}
                    />
                </div>
                <DialogFooter>
                    {isSearching && (
                        <Button onClick={cancelSearch}>Cancel</Button>
                    )}
                    <Button
                        disabled={isSearching}
                        className=""
                        onClick={startSearch}
                    >
                        {isSearching
                            ? `Searching... [ ${searchTimer} ]`
                            : "Start"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
