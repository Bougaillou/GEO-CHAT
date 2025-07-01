'use client'

import { useEffect, useRef, useState } from "react";
import PromptBox from "@/components/PromptBox";
import { assets } from '@/assets/assets'
import React from 'react'
import Image from 'next/image'
import MessagesDisplay from "./MessagesDisplay";
import MapDisplay from "./MapDisplay";

const MainChatPage = ({ expand, setExpand }: { expand: boolean, setExpand: (expand: boolean) => void }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [displayMap, setDisplayMap] = useState(false)

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
            {/* Top bar for small screens */}
            <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
                <Image onClick={() => (expand ? setExpand(false) : setExpand(true))} className="rotate-180" src={assets.menu_icon} alt="menu_icon" />
                <Image className="opacity-70" src={assets.chat_icon} alt="chat_icon" />
            </div>

            {/* Messages and Prompt */}
            <MessagesDisplay isLoading={isLoading} setIsLoading={setIsLoading} />
            <PromptBox
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setDisplayMap={setDisplayMap}
                displayMap={displayMap}
            />

            {/* Footer Text */}
            <p className="text-xs absolute bottom-1 text-gray-500 mt-2">AI-generated, GEO-Chat</p>

            {/* Map Overlay */}
            <MapDisplay displayMap={displayMap} setDisplayMap={setDisplayMap} />
        </div>
    );
}


export default MainChatPage