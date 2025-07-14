"use client"
import { assets } from '@/assets/assets';
import Message from "@/components/Message";
import { MessageInterface, useAppContext } from "@/context/AppContext";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const MessagesDisplay = ({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: (isLoading: boolean) => void }) => {

    const [messages, setMessages] = useState<MessageInterface[]>([])
    const { selectedChat } = useAppContext()
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages)
        }
    }, [selectedChat])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])
    return (
        <>

            {
                messages.length === 0 ? (
                    <>
                        <div className="flex items-center gap-3">
                            <Image src={assets.logo_icon} alt="logo_icon" className="size-16" />
                            <p className="text-2xl font-medium">Hi, I'm GEO-Chat.</p>
                        </div>
                        <p className="text-sm mt-2">How can I help you ?</p>
                    </>
                ) : (
                    <>
                        <div ref={containerRef}
                            className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
                        >
                            <p className="fixed top-8 border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">{selectedChat?.name}</p>
                            {messages.map((message, id) => (
                                <Message key={id} role={message.role} content={message.content} />
                            ))
                            }{
                                isLoading && (
                                    <div className="flex gap-4 max-w-2xl w-full py-3">
                                        <Image className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="logo_icon" />
                                        <div className="loader flex justify-center items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                                            <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                                            <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }

        </>
    )
}

export default MessagesDisplay