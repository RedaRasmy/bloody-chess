import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import RegisterForm from "./register-form"

export default async function RegisterPage() {
    const session = await getServerSession()

    if (session?.user) {
        redirect("/")
    }

    return (
        <div className="flex justify-center items-center h-full">
            <RegisterForm />
        </div>
    )
}
