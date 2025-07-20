'use client'
import { useChat } from '@/actions/ChatContext'
import { useUser } from '@/actions/UserContext'
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
  // const [chats, setChats] = useState<Chat[]>([])
  // const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<RegionCoordinates | null>(null)
  const [isMapVisible, setIsMapVisible] = useState(false)

  // useContext
  const { isLoading, setIsLoading } = useUser()
  const { chats, currentChat, createChat, deleteChat, selectChat, createMessage } = useChat()

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
    createChat('New Chat')
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const sendMessage = async (content: string, region?: RegionCoordinates) => {
    createMessage(content, mockApi.generateMockResponse(content, region))
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