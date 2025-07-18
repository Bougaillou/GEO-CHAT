import React from 'react'
import Markdown from 'react-markdown'

interface MessageContentProps {
    content: string
}

const MessageContent = ({ content }: MessageContentProps) => {
    return (
        <>
            <div className='text-gray-800 whitespace-pre-wrap'>
                <Markdown>{content}</Markdown>
            </div>
        </>
    )
}

export default MessageContent