
import { useState, useRef, useEffect } from "react";
import { useChat, Message } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ChatBox = () => {
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Team Chat</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-4 animate-fade-in">
            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline">
                  <span className="font-medium mr-2">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                <div className="mt-1 text-sm bg-secondary p-3 rounded-md">
                  {message.text}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
