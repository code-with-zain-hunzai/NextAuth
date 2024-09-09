"use client"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"
const UserAccountnav = () => {
    return (
        <div>
            <Button onClick={() => signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/sign-in`
            })
            } variant='destructive'>Sign Out</Button>
        </div>
    )
}

export default UserAccountnav
