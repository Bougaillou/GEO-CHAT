
import { Chat } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import axios from "axios";

interface ChatContextType {
    chats: Chat[]
    currentChat: Chat | null
    createChat: (title: string) => Promise<void>
    deleteChat: (chatId: string) => Promise<void>
    selectChat: (chatId: string) => void
    createMessage: (content: string, role: string) => void
    updateChatTime: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)


export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [chats, setChats] = useState<Chat[]>([])
    const [currentChat, setCurrentChat] = useState<Chat | null>(null)
    const { setIsLoading } = useUser()

    const fetchChats = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get('/api/chat/get')
            setChats(res.data)
        } catch (error) {
            const err = error as Error
            return new Response(JSON.stringify({ success: false, error: err.message }))
        }
    }

    useEffect(() => {
        fetchChats()
    }, [])

    const createChat = async (title: string) => {
        const res = await axios.post('/api/chat/create', { title })
        setChats(prev => [res.data, ...prev])
        setCurrentChat(res.data)
    }

    const deleteChat = async (chatId: string) => {
        axios.post('/api/chat/delete', { chatId })
        setChats(prev => prev.filter(c => c.id !== chatId))
        if (currentChat?.id === chatId) {
            setCurrentChat(chats[0] || null)
        }
    }

    const selectChat = (chatId: string) => {
        const chat = chats.find(c => c.id === chatId)
        if (chat) setCurrentChat(chat)
    }

    const createMessage = async (content: string, role: string) => {
        await axios.post('/api/chat/message', { content, role })
        fetchChats()
    }

    const updateChatTime = async () => {
        await axios.post('/api/chat/updateTime')
        fetchChats()
    }

    const value = {
        chats,
        currentChat,
        createChat,
        deleteChat,
        selectChat,
        createMessage,
        updateChatTime
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const ctx = useContext(ChatContext)
    if (!ctx) throw new Error("useChat must be used within ChatProvider")
    return ctx
}