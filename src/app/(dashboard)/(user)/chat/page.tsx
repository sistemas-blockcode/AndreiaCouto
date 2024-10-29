'use client'
import Sidebar from "@/app/components/students/sidebar";
import Sidechat from "@/app/components/students/sidechat";
import Chat from "@/app/components/students/chat";
import { AuthProvider } from '@/app/components/context/AuthContext';
import { useState } from 'react';

export default function Page() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    setIsChatOpen(true);
  };

  const handleBackToChatList = () => {
    setIsChatOpen(false);
  };

  return (  
    <div className="flex h-screen">
      <AuthProvider>
        <div className="flex flex-1">
          <div className={`w-full sm:w-80 ${isChatOpen ? 'hidden sm:block' : ''}`}>
            <Sidechat onSelectConversation={handleSelectConversation} />
          </div>
          
          <div className={`flex-1 ${isChatOpen ? 'block' : 'hidden'} sm:block`}>
            <Chat selectedConversationId={selectedConversationId} onBack={handleBackToChatList} />
          </div>
        </div>
      </AuthProvider>
    </div>
  );
}
