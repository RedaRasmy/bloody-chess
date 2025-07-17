import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import SignInForm from "./signin-form"

export default async function SignInPage() {
    const session = await getServerSession()

    if (session?.user) {
        redirect("/")
    }

    return <SignInForm />
}
