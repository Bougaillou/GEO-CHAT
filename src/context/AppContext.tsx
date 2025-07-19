"use client"

import { checkUser } from "@/lib/checkUser";
import { useAuth, useUser } from "@clerk/nextjs"
import type { UserResource } from '@clerk/types';
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";

export const AppContext = createContext<any>(null)

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    // const user = checkUser()

    const { user } = useUser()

    const { getToken } = useAuth()

    const value = {
        user
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

