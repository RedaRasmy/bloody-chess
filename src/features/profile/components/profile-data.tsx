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
        <div className="flex gap-3 lg:gap-5 portrait:flex-row portrait:h-2/6  bg-gray-600 py-5 rounded-lg flex-col px-3 lg:px-6">
            <div className="flex flex-col gap-2 pl-2 text-nowrap justify-between h-full text-white w-full">
                <div className="gap-3 flex flex-col">
                    <p >
                        <span className="font-semibold">Username</span> <br/> <span className="font-normal pl-2"> {username}</span>
                    </p>
                    <p className="font-semibold">
                        <span className="font-semibold">Email</span> <br/> <span className="font-normal pl-2"> {email}</span>
                    </p>
                </div>
                <LogOutButton  />
            </div>
        </div>
    )
}
