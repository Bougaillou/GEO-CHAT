'use Client'
import { RegionCoordinates } from '@/types';
import React, { useEffect, useRef, useState } from 'react'
import { Textarea } from './ui/Textarea';
import { TEXTAREA_PLACEHOLDER } from '@/lib/constant';
import { Button } from './ui/Button';
import { Map, Send, X } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string, region?: RegionCoordinates) => void;
  onToggleMap: () => void;
  selectedRegion: RegionCoordinates | null;
  onClearRegion: () => void;
  isLoading: boolean;
}

const ChatInput = ({ isLoading, onSendMessage, selectedRegion, onToggleMap, onClearRegion }: ChatInputProps) => {
  // useState
  const [message, setMessage] = useState('')

  // useRef
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // useEffect
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + "px"

    }
  }, [message])
console.log(selectedRegion)
  // handelers
  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), selectedRegion || undefined)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handelSubmit(e)
    }
  }

  const handelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  return (
    <>
      <div className='border-t border-gray-200 bg-white p-4'>
        <div className='max-w-4xl mx-auto'>
          <form onSubmit={handelSubmit}>
            <div className='relative'>
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handelChange}
                onKeyDown={handleKeyDown}
                placeholder={TEXTAREA_PLACEHOLDER}
                className='min-h-11 max-h-32 pr-20 resize-none border-gray-300 focus:border-blue-400 focus:ring-blue-400'
                rows={1}
                disabled={isLoading}
              />

              <div className='absolute right-2 bottom-2 flex space-x-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={onToggleMap}
                  className='w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg'
                >
                  <Map className='size-4 text-gray-600' />
                </Button>
                <Button
                  type='submit'
                  size='icon'
                  disabled={!message.trim() || isLoading}
                  className='w-8 h-8 bg-blue-400 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50'
                >
                  <Send className='size-4' />
                </Button>
              </div>
            </div>
          </form>

          {selectedRegion && (
            <div className='mt-2 flex items-center text-sm text-gray-600'>
              <Map className='size-4 mr-1' />
              <span>
                Selected region : ({selectedRegion.lat.toFixed(2)},{selectedRegion.lng.toFixed(2)})
              </span>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClearRegion}
                className='ml-2 w-4 h-4 text-red-500 hover:text-red-700 hover:bg-transparent'
              >
                <X className='size-3' />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ChatInput