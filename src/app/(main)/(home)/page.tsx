import { ChatProvider } from "@/actions/ChatContext";
import ChatPage from "../ChatPage";
import { UserProvider } from "@/actions/UserContext";


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
