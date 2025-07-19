"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@prisma/client"
import axios from "axios"

type UserContextType = {
    user: User | null
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/user")
                setUser(res.data.user)
            } catch (err) {
                console.error("User fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, isLoading, setIsLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error("useUser must be used within ChatProvider")
    return ctx
}
