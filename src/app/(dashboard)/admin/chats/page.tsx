'use client'
import Sidebar from "@/app/components/ui/sidebar";
import Sidechat from "@/app/components/ui/sidechat";
import Chat from "@/app/components/ui/chat";
import { CoursesProvider } from '@/app/components/context/CourseContext';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

interface Message {
  text: string;
}

interface Conversation {
  id: number;
  participantA: User;
  participantB: User;
  messages: Message[];
}

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedContactName, setSelectedContactName] = useState<string>(''); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const adminId = 3;

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations/getConversations?userId=${adminId}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    setIsChatOpen(true);

    const selectedConversation = conversations.find((conv) => conv.id === id);
    if (selectedConversation) {
      const contactName = selectedConversation.participantA.id === adminId
        ? selectedConversation.participantB.name
        : selectedConversation.participantA.name;
      setSelectedContactName(contactName);
    }
  };

  const handleBackToChatList = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="flex h-screen">
      <CoursesProvider>
        <div className="flex flex-1">
          <div className={`w-full sm:w-80 ${isChatOpen ? 'hidden sm:block' : ''}`}>
            <Sidechat
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              fetchConversations={fetchConversations}
              adminId={adminId}
            />
          </div>
          <div className={`flex-1 ${isChatOpen ? 'block' : 'hidden'} sm:block`}>
            <Chat
              selectedConversationId={selectedConversationId}
              onBack={handleBackToChatList}
              adminId={adminId}
              contactName={selectedContactName}
              fetchConversations={fetchConversations}
            />
          </div>
        </div>
      </CoursesProvider>
    </div>
  );
}
