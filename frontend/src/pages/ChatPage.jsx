import { useChatStore } from "../store/useChatStore"
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import ProfileHeader from "../components/ProfileHeader"
import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatList from "../components/ChatList"
import ContactList from "../components/ContactList"
import ChatWindow from "../components/ChatWindow"
import EmptyState from "../components/EmptyState"



function ChatPage() {

  const { activeTab,selectedChat } = useChatStore()
  return (
    <div className=" relative w-full max-w-6xl h-[650px]">

    <BorderAnimatedContainer>
      {/* left side */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
      <ProfileHeader />
      <ActiveTabSwitch/>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeTab==="chats" ? <ChatList /> : <ContactList />}
      </div>
      </div>

      {/* right side */}
      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
      {selectedChat ? <ChatWindow /> : <EmptyState />}
      </div>
    </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage