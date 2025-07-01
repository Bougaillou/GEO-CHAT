'use client'
import SideBar from "@/components/SideBar";
import MainChatPage from "@/components/MainChatPage";
import { useState } from "react";
// import Message from "@/components/Message";

export default function Home() {

  const [expand, setExpand] = useState(false)

  return (
    <>
      <div>
        <div className="flex h-screen">
          <SideBar
            expand={expand}
            setExpand={setExpand}
          />
          <MainChatPage
            expand={expand}
            setExpand={setExpand}
          />
        </div>
      </div>
    </>
  );
}
