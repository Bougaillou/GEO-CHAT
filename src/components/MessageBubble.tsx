import { ChatMessage } from '@/types';
import { Bot } from 'lucide-react';
import React from 'react'
import MessageContent from './MessageContent';

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isUser = message.role === 'user'

    return (
        <>
            <div className={`flex animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg p-4 max-w-2xl shadow-sm ${isUser ? 'bg-white border border-gray-200' : 'bg-gray-200'}`} >
                    {!isUser ? (
                        <div className='flex items-start space-w-3'>
                            <div className='w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0'>
                                <Bot className='size-4 text-white' />
                            </div>
                            <div>
                                <MessageContent content={message.content} />
                            </div>
                        </div>
                    ) : (
                        <div className='text-gray-800' >
                            <MessageContent content={message.content} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MessageBubble