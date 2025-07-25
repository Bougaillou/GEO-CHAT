'use client'
import { assets } from '@/assets/assets'
import React, { EventHandler, KeyboardEventHandler, useState } from 'react'
import Image from "next/image";
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Map } from 'lucide-react';

const PromptBox = ({ isLoading, setIsLoading, displayMap, setDisplayMap }: { isLoading: boolean, setIsLoading: (isLoading: boolean) => void, displayMap: boolean, setDisplayMap: (displayMap: boolean) => void }) => {

    const [prompt, setPrompt] = useState('')
    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext()

    const sendPrompt = async () => {
        const promptCopy = prompt

        try {
            if (!user) return toast.error('Login to send Message')
            if (isLoading) return toast.error("Wait fot the prvious prompt")

            setIsLoading(true)
            setPrompt('')

            const userPrompt = {
                role: 'user',
                content: prompt,
                timestamp: Date.now()
            }

            setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat!._id ? {
                ...chat, messages: [...chat.messages, userPrompt]
            } : chat))

            setSelectedChat((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    messages: [...prev.messages, userPrompt],
                };
            });
            const { data } = await axios.post('/api/chat/ai', {
                chatId: selectedChat?._id,
                prompt
            })

            if (data.success) {
                setChats((prev) => prev.map((chat) => chat._id === selectedChat!._id
                    ? { ...chat, messages: [...chat.messages, userPrompt] } : chat))

                const message = data.data.content
                const messageTokens = message.split(' ')
                let assistingMessage = {
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                }
                setSelectedChat((prev) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        messages: [...prev.messages, assistingMessage],
                    };
                });

                for (let i = 0; i < messageTokens.length; i++) {
                    setTimeout(() => {
                        assistingMessage.content = messageTokens.slice(0, i + 1).join(' ')
                        setSelectedChat((prev) => {
                            if (!prev) return prev
                            const updatedMessages = [
                                ...prev.messages.slice(0, -1), assistingMessage
                            ]

                            return { ...prev, messages: updatedMessages }
                        });
                    }, i * 100)
                }
            } else {
                toast.error(data.message)
                setPrompt(promptCopy)
            }

        } catch (error) {
            const err = error as Error
            toast.error(err.message)
            setPrompt(promptCopy)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendPrompt();
        }
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendPrompt()
    };


    return (
        <>
            <form
                onSubmit={handleOnSubmit}
                className={`w-full ${selectedChat?.messages?.length ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
            >
                <textarea
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
                    rows={2}
                    placeholder='Your Prompt' required
                />
                <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                        {/* <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                            <Image className='h-5' src={assets.deepthink_icon} alt='deepthink_icon' />
                            DeepThink (R1)
                        </p>
                        <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                            <Image className='h-5' src={assets.search_icon} alt='search_icon' />
                            Search
                        </p> */}
                        <p onClick={() => displayMap ? setDisplayMap(false) : setDisplayMap(true)} className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                            <Map className='h-5 text-gray-400' /> Map
                        </p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Image className='w-4 cursor-pointer' src={assets.pin_icon} alt='pin_icon' />
                        <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                            <Image className='w-3.5 aspect-square' src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt='arrow_icon' />
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default PromptBox