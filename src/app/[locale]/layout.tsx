import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"
import StoreProvider from "@/components/providers/store-provider"
import { getServerSession } from "next-auth"
import SessionProvider from "@/components/providers/session-provider"
import NavMenu from "@/components/nav-menu"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { ReactScan } from "@/components/react-scan"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Bloody Chess",
    description: "",
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    const session = await getServerSession()
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    return (
        <html lang={locale}>
            <ReactScan />
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex-col flex`}
            >
                <StoreProvider>
                    <NextIntlClientProvider>
                        <SessionProvider session={session}>
                            <SidebarProvider>
                                <AppSidebar />
                                <div className="w-full flex flex-col ">
                                    <Header isAuthenticated={!!session?.user}/>
                                    <main className="px-3 md:px-5 lg:px-7 overflow-auto h-full">
                                        {children}
                                    </main>
                                </div>
                            </SidebarProvider>
                        </SessionProvider>
                    </NextIntlClientProvider>
                </StoreProvider>
            </body>
        </html>
    )
}
