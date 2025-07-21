'use client'

import { Chat } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { mockApi } from "@/services/api";
import { useUser } from "./UserContext";

interface ChatContextType {
    chats: Chat[]
    currentChat: Chat | null
    createChat: (title: string) => Promise<Chat>
    deleteChat: (chatId: string) => Promise<void>
    selectChat: (chatId: string) => Promise<void>
    // createMessage: (content: string, role: string, chatId?: string) => Promise<void>
    createMessage: (userContent: string, assistantContent: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [chats, setChats] = useState<Chat[]>([])
    const [currentChat, setCurrentChat] = useState<Chat | null>(null)
    const { setIsLoading } = useUser()

    useEffect(() => {
        const fetchChats = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get('/api/chat/get')
                if (res.data.success) {
                    // Ensure each chat has a messages array
                    const chatsWithMessages = (res.data.data || []).map((chat: any) => ({
                        ...chat,
                        messages: chat.messages || []
                    })) as Chat[]
                    setChats(chatsWithMessages)
                }
            } catch (error) {
                console.error('Error fetching chats:', error)
                setChats([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchChats()
    }, [])

    const createChat = async (title: string): Promise<Chat> => {
        const res = await axios.post('/api/chat/create', { title })
        const newChat: Chat = {
            ...res.data.data,
            messages: res.data.data.messages || []
        }
        setChats(prev => [newChat, ...prev])
        setCurrentChat(newChat)
        return newChat
    }

    const deleteChat = async (chatId: string) => {
        const res = await axios.post('/api/chat/delete', { chatId })
        if (res.data.success) {
            setChats(prev => prev.filter(c => c.id !== chatId))
            if (currentChat?.id === chatId) {
                const remainingChats = chats.filter(c => c.id !== chatId);
                setCurrentChat(remainingChats[0] || null)
            }
        }
    }

    const selectChat = async (chatId: string) => {
        const chat = chats.find(c => c.id === chatId)
        if (chat) setCurrentChat(chat)
    }

    const createMessage = async (userContent: string, assistantContent: string) => {
        if (!userContent.trim()) return;

        let chatToUpdate = currentChat;

        if (!chatToUpdate) {
            chatToUpdate = await createChat(mockApi.generateMockTitle(userContent))
        }

        if (!currentChat) {
            return console.log('No Current Chat')
        }

        const userMessage = await axios.post('/api/chat/message', {
            content: userContent,
            role: 'user',
            chatId: currentChat.id
        })

        const updatedChat = {
            ...chatToUpdate,
            messages: [...chatToUpdate.messages, userMessage.data.data],
            updatedAt: new Date()
        }

        setCurrentChat(updatedChat);
        setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));

        // Show loading state
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const assistantMessage = await axios.post('/api/chat/message', {
                content: assistantContent,
                role: 'assistant',
                chatId: currentChat.id
            })

            const finalChat = {
                ...updatedChat,
                messages: [...updatedChat.messages, assistantMessage.data.data],
                updatedAt: new Date()
            }

            setCurrentChat(finalChat);
            setChats(prev => prev.map(c => c.id === finalChat.id ? finalChat : c));

            updateChatTime(currentChat.id)

        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error state
        } finally {
            setIsLoading(false);
        }

    }

    const updateChatTime = async (chatId?: string) => {
        const targetChatId = chatId || currentChat?.id
        if (!targetChatId) return console.log('No chat ID for time update')

        try {
            await axios.post('/api/chat/updateTime', { chatId: targetChatId })
        } catch (error) {
            console.error('Error updating chat time:', error)
        }
    }

    const value = {
        chats,
        currentChat,
        createChat,
        deleteChat,
        selectChat,
        createMessage
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