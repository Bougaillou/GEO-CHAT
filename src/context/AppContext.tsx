"use client"

import { useUser } from "@clerk/nextjs"
import { createContext, useContext } from "react"

export interface UserContract {
    id?: string
    firstName?: string
    email?: string
    lastName?: string
    image?: string
}

export interface AppState {
    user?: UserContract
}

const defaultState: AppState = {
    user: {},
}

export const AppContext = createContext<AppState>(defaultState)

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser()

    const mappedUser: UserContract = {
        id: user?.id || undefined,
        firstName: user?.firstName || undefined,
        email: user?.emailAddresses?.[0]?.emailAddress || undefined,
        lastName: user?.lastName || undefined,
        image: user?.imageUrl || undefined
    }

    const value: AppState = {
        user: mappedUser,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
