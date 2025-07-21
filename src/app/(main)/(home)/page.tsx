import { ChatProvider } from "@/context/ChatContext";
import ChatPage from "../ChatPage";
import { UserProvider } from "@/context/UserContext";


export default function Home() {

  return (
    <>
      <UserProvider>
        <ChatProvider>
          <ChatPage />
        </ChatProvider>
      </UserProvider>
    </>
  );
}
