import ChatPage from "../ChatPage";
import { UserProvider } from "@/actions/UserContext";


export default function Home() {

  return (
    <>
      <UserProvider>
        <ChatPage />
      </UserProvider>
    </>
  );
}
