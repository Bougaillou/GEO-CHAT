'use client'
import ChatArea from '@/components/ChatArea'
import ChatInput from '@/components/ChatInput'
import MapPanel from '@/components/MapPanel'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/Button'
import { useIsMobile } from '@/hooks/useMobile'
import { PROJECT_TITLE } from '@/lib/constant'
import { mockApi } from '@/services/api'
import { Chat, ChatMessage, RegionCoordinates } from '@/types'
import { Menu } from 'lucide-react'
import React, { useState } from 'react'

const ChatPage = () => {
  // useSate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<RegionCoordinates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(false)


  // hooks
  const isMobile = useIsMobile()

  // Map functions
  const toggleMap = () => {
    setIsMapVisible(!isMapVisible)
  }

  const clearRegion = () => {
    setSelectedRegion(null)
  }

  const confirmRegion = (region: RegionCoordinates) => {
    setSelectedRegion(region)
    setIsMapVisible(false)
  }

  // Chat functions
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setChats(prev => [newChat, ...prev])
    setCurrentChat(newChat)
    setSelectedRegion(null)

    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setCurrentChat(chat)
      setSelectedRegion(null)
    }
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId))

    if (currentChat?.id === chatId) {
      const remainingChats = chats.filter(c => c.id !== chatId)
      setCurrentChat(remainingChats[0] || null)
    }
  }

  const sendMessage = async (content: string, region?: RegionCoordinates) => {
    if (!content.trim()) return

    let chatToUpdate = currentChat

    // Create new chat if not exist
    if (!chatToUpdate) {
      chatToUpdate = {
        id: Date.now().toString(),
        title: mockApi.generateMockTitle(content),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setChats(prev => [chatToUpdate!, ...prev])
      setCurrentChat(chatToUpdate)
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    // Update chat with user message
    const updatedChat = {
      ...chatToUpdate,
      messages: [...chatToUpdate.messages, userMessage],
      updatedAt: new Date()
    }

    setCurrentChat(updatedChat)
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c))

    // Update chat title if this is the first message
    if (chatToUpdate.messages.length === 0) {
      const newTitle = mockApi.generateMockTitle(content)
      updatedChat.title = newTitle
      setChats(prev => prev.map(c => c.id === updatedChat.id ? { ...c, title: newTitle } : c))
    }

    // Start Loading
    setIsLoading(true)

    try {
      // API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate  reponce
      const assistanceResponse = mockApi.generateMockResponse(content, region) // CHANGE

      const assistanceMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistanceResponse,
        timestamp: new Date()
      }

      // Add assistant message
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistanceMessage],
        updatedAt: new Date()
      }

      setCurrentChat(finalChat)
      setChats(prev => prev.map(c => c.id === finalChat.id ? finalChat : c))
    } catch (error) {
      console.error('Error sending message:', error)
      // Handle error state
    } finally {
      setIsLoading(false)
    }
  }


  // onClick functions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <div className='flex h-screen bg-white'>
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          onNewChat={createNewChat}
          chats={chats}
          currentChatId={currentChat?.id || null}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
        />

        {/* Main */}
        <div className='flex-1 flex flex-col relative'>
          {/* Mobile Sidebar Toogle */}
          {isMobile && (
            <div className='bg-white border-b border-gray-200 p-4 flex items-center justify-between'>
              <Button
                variant="ghost"
                size='icon'
                onClick={toggleSidebar}
                className='text-gray-600 hover:text-gray-800'
              >
                <Menu className='size-4' />
              </Button>
              <h1 className='text-lg font-semibold'>{PROJECT_TITLE}</h1>
              <div className='w-8'></div>
            </div>
          )}
          {/* Chat Area */}
          <ChatArea
            messages={currentChat?.messages || []}
            isLoading={isLoading}
          />
          {/* Chat Input */}
          <ChatInput
            isLoading={isLoading}
            onSendMessage={sendMessage}
            selectedRegion={selectedRegion}
            onToggleMap={toggleMap}
            onClearRegion={clearRegion}
          />
        </div>

        {/* Map Panel */}
        <MapPanel
          isVisible={isMapVisible}
          onClose={toggleMap}
          onConfirmRegion={confirmRegion}
        />

      </div>
    </>
  )
}

export default ChatPage