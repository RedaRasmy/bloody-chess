'use client'
import { 
  Users, 
  Bot, 
  User, 
  Settings, 
  Gamepad2
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from 'next/image'
import LogOutButton from "@/features/profile/components/log-out-button"
import { cn } from "@/lib/utils"

const gameItems = [
  { title: "Play vs Human", url: "/multiplayer", icon: Users },
  { title: "Play vs Bot", url: "/bot", icon: Bot },
]

const menuItems = [
  { title: "Profile", url: "/profile", icon: User },
//   { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isCollapsed = state === "collapsed"
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"

  return (
    <Sidebar
      className={cn(isCollapsed ? "w-14" : "w-64")}
      collapsible="icon"
    >
      <SidebarContent className="bg-background">
        {/* App Header */}
        <div className="p-4 border-b border-sidebar-border ">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="size-9 bg-gradient-primary rounded-lg flex items-center justify-center">
              {/* <Crown className="w-5 h-5 text-primary-foreground" /> */}
              <Image src="/images/red-rook.png" alt="bloody-chess" width={100} height={100}/>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">Bloody Chess</h1>
                <p className="text-xs text-sidebar-foreground/70">Play & Improve</p>
              </div>
            )}
          </Link>
        </div>

        {/* Game Section */}
        <SidebarGroup >
          <SidebarGroupLabel className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            {!isCollapsed && "Play Chess"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gameItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={getNavCls({isActive :isActive(item.url)})}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {!isCollapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={getNavCls({isActive :isActive(item.url)})}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-background">
        {/* <div className="flex flex-row-reverse px-2 py-2">
              <LogOutButton/>
        </div> */}
      </SidebarFooter>
    </Sidebar>
  )
}