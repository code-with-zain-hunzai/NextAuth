"use client"
import { SessionProvider } from "next-auth/react"
import { ReactNode, FC } from "react"

interface ProviderProps {
    children: ReactNode
}

const Provider: FC<ProviderProps> = ({ children }) => {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}

export default Provider
