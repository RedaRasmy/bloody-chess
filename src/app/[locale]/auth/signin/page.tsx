import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import SignInForm from "./signin-form"
// import { getProviders } from "next-auth/react"

export default async function SignInPage() {
    const session = await getServerSession()

    if (session?.user) {
        redirect("/")
    }
    // const providersRecord = await getProviders()
    // const blackList = ["credentials", "email-confirmation"]
    // const providers = providersRecord
    //     ? Object.values(providersRecord).filter(
    //           (p) => !blackList.includes(p.id)
    //       )
    //     : []


    return <div className="flex justify-center items-center h-full">
        <SignInForm providers={[]} />
    </div>
}
