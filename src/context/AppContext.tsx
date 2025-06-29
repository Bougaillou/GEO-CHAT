"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import type { UserResource } from '@clerk/types';
import axios from "axios";
import { get } from "http";
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";

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
    const { getToken } = useAuth()

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

    const createNewChat = async () => {
        try {
            if (!user) return null

            const token = await getToken()

            await axios.post('api/chat/create', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchUsersChat()
        } catch (error) {
            const err = error as Error
            toast.error(err.message)
        }
    }

    const fetchUsersChat = async () => {
        try {
            const token = await getToken()

            const { data } = await axios.get('api/chat/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                console.log(data.data)
                setChats(data.data)

                if (data.data.length === 0) {
                    await createNewChat()
                    return fetchUsersChat()
                } else {
                    data.data.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

                    setSelectedChat(data.data[0])
                    console.log(data.data[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            const err = error as Error
            toast.error(err.message)

        }
    }
    useEffect(() => {
        if (user) {
            fetchUsersChat()
        }
    }, [user])
    const value = {
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChat,
        createNewChat
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
