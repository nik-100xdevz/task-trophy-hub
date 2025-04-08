
import ChatBox from "@/components/chat/ChatBox";

const ChatPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Team Chat</h1>
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border h-[70vh]">
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
