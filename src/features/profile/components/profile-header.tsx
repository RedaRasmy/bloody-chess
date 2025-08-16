import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, Trophy } from "lucide-react"
import LogOutButton from "./log-out-button"

type Props = {
    username: string
    gamesPlayed: number
    wins: number
}

export default function ProfileHeader({ username, gamesPlayed, wins }: Props) {
    return (
        <Card className="lg:mx-2 xl:mx-5 not-md:-space-y-3">
            <CardHeader>
                <div className="flex gap-5 items-center justify-between">
                    <h1 className="text-2xl  font-semibold">{username}</h1>
                    <LogOutButton variant={'outline'} size="sm" className="-mb-1"/>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-around">
                    <div className="flex flex-col gap-1 lg:gap-2 items-center">
                        <div className="flex gap-2 items-center">
                            <Trophy color="green" />
                            <span className="text-xl font-semibold">
                                {gamesPlayed}
                            </span>
                        </div>
                        <p className="text-muted-foreground">Games Played</p>
                    </div>
                    <div className="flex flex-col gap-1 lg:gap-2 items-center">
                        <div className="flex gap-2 items-center">
                            <TrendingUp color="orange" />
                            <span className="text-xl font-semibold">
                                {wins === 0 || gamesPlayed === 0
                                    ? 0
                                    : Number((wins / gamesPlayed).toFixed(4)) * 100
                                    }
                                %
                            </span>
                        </div>
                        <p className="text-muted-foreground">Win Rate</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
