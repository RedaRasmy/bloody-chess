import { SidebarTrigger } from "./ui/sidebar"


export default function Header({isAuthenticated}:{
    isAuthenticated : boolean
}) {
    return (
        <div className="h-10 flex items-center px-2 justify-between sticky">
            <SidebarTrigger />
            <p className="text-muted-foreground">Welcome back, Player</p>
        </div>
    )
}
