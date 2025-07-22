'use client'
import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble';
import { ChatMessage } from '@/types';
import WelcomeScreen from './WelcomeScreen';
import { Bot } from 'lucide-react';
import { ANALYSING_LOADING_TEXT } from '@/lib/constant';

interface ChatAreaProps {
    messages: ChatMessage[]
    isLoading: boolean
}

const ChatArea = ({ messages, isLoading }: ChatAreaProps) => {
    // useRef
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // useEffect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // console.log(messages)
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4">
                <WelcomeScreen />
            </div>
        )
    }

    return (
        <>
            <div className='flex-1 overflow-y-auto p-4' >
                <div className='space-y-4 max-w-4xl mx-auto'>
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={`${message.id}-${index}`}
                            message={message}
                        />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#F7F7F8] rounded-lg p-4 max-w-2xl shadow-sm">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className="text-sm text-gray-500">{ANALYSING_LOADING_TEXT}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>
        </>
    )
}

export default ChatArea