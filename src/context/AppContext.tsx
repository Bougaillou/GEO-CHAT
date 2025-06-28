"use client"

import { useUser } from "@clerk/nextjs"
import type { UserResource } from '@clerk/types';
import { createContext, useContext } from "react"

export interface AppState {
    user?: UserResource | null | undefined
}

const defaultState: AppState = {
    user: null,
}

export const AppContext = createContext<AppState>(defaultState)

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser()

    const value: AppState = {
        user
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
