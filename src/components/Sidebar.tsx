'use client'
import { Chat } from '@/types'
import React, { useState } from 'react'
import { Earth, Menu, Plus, Trash2, User, X } from 'lucide-react'
import { ADD_NEW_CHAT_TEXT, DELETE_CHAT_CONFIRMATION_MESSAGE, PROJECT_TITLE, RECENT_CHATS } from '@/lib/constant'
import { Button } from '@/components/ui/Button'
import { ScrollArea } from './ui/ScrollArea'
import { UserButton } from '@clerk/nextjs'


interface SidebarProps {
    chats: Chat[]
    currentChatId: string | null
    onNewChat: () => void
    onSelectChat: (chatId: string) => void
    onDeleteChat: (chatId: string) => void
    isOpen: boolean
    onToggle: () => void
}

const Sidebar = ({ isOpen, onToggle, onNewChat, chats, currentChatId, onSelectChat, onDeleteChat }: SidebarProps) => {
    // useState
    const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)


    // handelers
    const handelDeleteChat = (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation()
        if (confirm(DELETE_CHAT_CONFIRMATION_MESSAGE)) {
            onDeleteChat(chatId)
        }
    }

    return (
        <>
            {/* TO CHECK */}
            {isOpen &&
                <div
                    className='fixed inset-0 bg-black z-10 md:hidden'
                    onClick={onToggle}
                >
                </div>
            }

            {/* Sidebar */}
            <div className={`fixed md:relative  inset-y-0 z-50 w-64 bg-gray-300 text-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} >
                {/* Header */}
                <header className='p-4 border-b border-gray-600'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <div className='w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center'>
                                <Earth className='size-4 text-white' />
                            </div>
                            <h1 className={`text-lg font-semibold ${isOpen ? 'text-white' : 'text-black'}`}>{PROJECT_TITLE}</h1>
                        </div>
                        <Button
                            variant="ghost"
                            size='icon'
                            onClick={onToggle}
                            className='md:hidden text-white over:bg-gray-600'
                        >
                            <X className='size-4' />
                        </Button>
                    </div>
                </header>
                {/* New Chat */}
                <div className='p-4'>
                    <Button
                        onClick={onNewChat}
                        className='w-full bg-blue-400 hover:bg-blue-500 text-white'
                    >
                        <span>{ADD_NEW_CHAT_TEXT}</span><Plus className='size-4 mr-2' />
                    </Button>
                </div>
                {/* Chat History */}
                <div className='flex-1 overflow-hidden'>
                    <div className='px-4 py-2'>
                        <div className='"text-xs text-gray-400 mb-2 uppercase tracking-wider'>
                            {RECENT_CHATS}
                        </div>
                    </div>
                    <ScrollArea className='flex-1 px-4' >
                        <div className='space-y-2 pb-4'>
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${currentChatId === chat.id ? "bg-gray-700" : "hover:bg-gray-600"}`}
                                    onClick={() => onSelectChat(chat.id)}
                                    onMouseEnter={() => setHoveredChatId(chat.id)}
                                    onMouseLeave={() => setHoveredChatId(null)}
                                >
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-sm truncate'>{chat.title}</div>
                                        <div className='text-xs text-gray-400'>{new Date(chat.updatedAt).toLocaleDateString()} </div>
                                    </div>
                                    {hoveredChatId === chat.id && (
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={(e) => handelDeleteChat(e, chat.id)}
                                            className='w-6 h-6 test-gray-4àà hover:text-red-400 hover:bg-transparent'
                                        >
                                            <Trash2 className='size-3' />
                                        </Button>
                                    )}
                                </div>
                            ))
                            }
                        </div>
                    </ScrollArea>
                </div>

                {/* Footer - User Profile */}
                <footer className='p-4 pt-7 border-t border-gray-600'>
                    <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center'>
                            {/* <User className='w-4 h-4 text-white' /> */}
                            <UserButton />
                        </div>
                        <div>
                            <div className={`text-sm font-medium ${isOpen ? 'text-white' : 'text-black'}`}>Ibrahim Bougaillou</div>
                        </div>
                    </div>
                </footer>
            </div >
        </>
    )
}

export default Sidebar