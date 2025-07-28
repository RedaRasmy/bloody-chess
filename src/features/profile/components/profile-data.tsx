import { Session } from "next-auth"
import LogOutButton from "./log-out-button"

export default function ProfileData({
    user : {
        username,
        email
    }
}:{
    user : Session['user']
}) {
    return (
        <div className="flex gap-3 lg:gap-5 portrait:flex-row portrait:h-2/6 bg-gray-100 py-5 rounded-lg flex-col px-3">
            <div className="flex flex-col gap-2 pl-2 text-nowrap">
                <p className="font-semibold">
                    username : <span className="font-normal">{username}</span>
                </p>
                <p className="font-semibold">
                    email : <span className="font-normal">{email}</span>
                </p>
                <LogOutButton />
            </div>
        </div>
    )
}
