"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { useClerk, UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'
import ChatLabel from './ChatLabel'

interface OpenMenu {
  id: number | string
  open: boolean
}

const SideBar = ({ expand, setExpand }: { expand: boolean, setExpand: (expand: boolean) => void }) => {

  const { openSignIn } = useClerk()
  const { user, chats, createNewChat } = useAppContext()
  const [openMenu, setOpenMenu] = useState<OpenMenu>({ id: 0, open: false })

  const handleSignInClick = () => {
    if (user) return null
    openSignIn();
  };

  return (
    <>
      <div className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${expand ? "p-4 w-64" : 'md:w-20 w-0 max-md:overflow-hidden'}`}>
        <div>
          <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`} >
            <Image className='size-10' src={assets.logo_icon} alt='logo_icon' />
            <div onClick={() => expand ? setExpand(false) : setExpand(true)}
              className="goup relative flex items-center justify-center hover:bg-gray-500/20 trransition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer">
              <Image onClick={() => (expand ? setExpand(false) : setExpand(true))} className="md:hidden" src={assets.menu_icon} alt="menu_icon" />
              <Image className="hidden md:block w-7" src={assets.sidebar_close_icon} alt="sidebar_close_icon" />
              <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"} opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 rounded-lg shadow-lg pointer-events-none`}>
                {expand ? 'Colse sidebar' : 'Open sidebar'}
                <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}>

                </div>
              </div>
            </div>
          </div>

          <button onClick={createNewChat} className={`mt-8 flex items-center justify-center cursor-pointer ${expand ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
            <Image className={expand ? 'w-6' : 'w-7'} src={expand ? assets.chat_icon : assets.chat_icon_dull} alt='chat_icon' />
            <div className='absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none'>
              New Chat
              <div className='w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5'></div>
            </div>
            {expand && <p className='text-white text font-medium'>New Chat</p>}
          </button>

          <div className={`my-8 text-white/25 text-sm ${expand ? "block" : 'hidden'}`} >
            <p className='my-1'>Recent</p>
            {chats.map((chat, index) => (
              <ChatLabel key={index} name={chat.name} id={chat._id} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            ))
            }
          </div>
        </div>
        <div>
          <div className={`flex items-center cursor-pointer group relative ${expand ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white cursor-pointer" : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
            <Image className={expand ? "w-5" : "w-6.5 mx-auto"} src={expand ? assets.phone_icon : assets.phone_icon_dull} alt="phone_icon" />
            <div className={`absolute -top-60 pb-8 ${!expand && "-right-40"} opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}>
              <div className='relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg'>
                <Image src={assets.qrcode} alt='qrcode' className='w-44' />
                <p>Scan to wisit us</p>
                <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "right-1/2" : "left-4"} -bottom-1.5`}></div>
              </div>
            </div>
            {expand && <><span>Visit Us</span> <Image alt='new_icon' src={assets.new_icon} /></>}
          </div>

          <div onClick={handleSignInClick}
            className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}>
            {user
              ? <UserButton />
              : <Image src={assets.profile_icon} alt='profile-icon' className='w-7' />
            }
            {expand && <span>{user ? `${user.firstName?.trim()} ${user.lastName?.trim()}` : 'My Profile'}</span>}
          </div>

        </div>
      </div>
    </>
  )
}

export default SideBar