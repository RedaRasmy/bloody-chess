import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="flex h-full justify-center items-center bg-gray-200">
            <div className="flex flex-col gap-2">
                <Button className="lg:w-sm w-50 py-6 cursor-pointer">
                    Play Online
                </Button>
                <Button className="lg:w-sm w-50 py-6 cursor-pointer">
                    Play Bot
                </Button>
            </div>
        </div>
    )
}
