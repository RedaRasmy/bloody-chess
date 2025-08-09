import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Bot,
    Clock,
    Crown,
    Play,
    TrendingUp,
    Calendar,
    Target,
    Zap,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-8 text-primary-foreground">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-3xl font-bold">
                            Welcome to Bloody Chess
                        </h1>
                    </div>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl">
                        Ready for your next game?
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            asChild
                            size="lg"
                            variant="secondary"
                            className="bg-white/20 hover:bg-white/30 w-45 text-white border-white/30"
                        >
                            <Link href="/multiplayer">
                                <Users className="w-5 h-5 mr-2" />
                                Play vs Human
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white/50 text-white w-45 hover:bg-white/10"
                        >
                            <Link href="/bot">
                                <Bot className="w-5 h-5 mr-2" />
                                Challenge AI
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            

            {/* Game Modes */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center w-full">
                <Card className="glass-strong max-w-3xl hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">
                                    Multiplayer Chess
                                </CardTitle>
                                <CardDescription>
                                    Challenge players from around the world
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Test your skills against real opponents in exciting
                            multiplayer matches with various time controls.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Bullet
                            </Badge>
                            <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Blitz
                            </Badge>
                            <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Rapid
                            </Badge>
                        </div>
                        <Button asChild className="w-full" variant={"outline"}>
                            <Link href="/multiplayer">
                                <Play className="w-4 h-4 mr-2" />
                                Start Playing
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-strong max-w-3xl hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center">
                                <Bot className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">
                                    AI Training
                                </CardTitle>
                                <CardDescription>
                                    Practice against intelligent bots
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Improve your game with AI opponents of varying
                            difficulty levels, from beginner to grandmaster.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Level 1-5</Badge>
                            <Badge variant="outline">Level 6-10</Badge>
                            <Badge variant="outline">Level 11-20</Badge>
                        </div>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/bot">
                                <Bot className="w-4 h-4 mr-2" />
                                Train with AI
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// import BotOptionsDialog from "@/features/bot/components/bot-options-dialog"
// import MultiplayerOptionsDialog from "@/features/multiplayer/components/multiplayer-options-dialog"
// import SettingsDialog from "@/features/settings/components/settings-dialog"

// export default async function Home({
//     searchParams
// }: {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// }) {
//     const {dialog} = await searchParams

//     const isBotDialogOpen = dialog === 'bot'
//     const isMultiplayerDialogOpen = dialog === 'multiplayer'

//     return (
//         <div className="flex h-full justify-center items-center  w-full">
//             <div className="flex flex-col gap-2 lg:gap-3 w-[min(90%,400px)]">
//                 <MultiplayerOptionsDialog defaultOpen={isMultiplayerDialogOpen}/>
//                 <BotOptionsDialog defaultOpen={isBotDialogOpen} />
//                 <SettingsDialog/>
//             </div>
//         </div>
//     )
// }
