"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@prisma/client"
import axios from "axios"

type UserContextType = {
    user: User | null
    userLoading: boolean
}

const UserContext = createContext<UserContextType>({
    user: null,
    userLoading: true,
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [userLoading, setUserLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/user")
                setUser(res.data.user)
            } catch (err) {
                console.error("User fetch error:", err)
            } finally {
                setUserLoading(false)
            }
        }

        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, userLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
