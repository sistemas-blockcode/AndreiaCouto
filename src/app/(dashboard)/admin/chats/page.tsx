'use client'
import Sidebar from "@/app/components/ui/sidebar";
import Sidechat from "@/app/components/ui/sidechat";
import Chat from "@/app/components/ui/chat";
import { CoursesProvider } from '@/app/components/context/CourseContext';
import { useState } from 'react';

export default function Page() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para controlar a visualização em telas móveis

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    setIsChatOpen(true); // Abrir a conversa no modo mobile
  };

  const handleBackToChatList = () => {
    setIsChatOpen(false); // Voltar para a lista de conversas no modo mobile
  };

  return (
    <div className="flex h-screen">
      <CoursesProvider>
        <div className="flex flex-1">
          {/* Exibir apenas Sidechat em telas grandes ou quando a conversa não estiver aberta no modo mobile */}
          <div className={`w-full sm:w-80 ${isChatOpen ? 'hidden sm:block' : ''}`}>
            <Sidechat onSelectConversation={handleSelectConversation} />
          </div>
          
          {/* Exibir Chat apenas em telas grandes ou quando a conversa estiver aberta no modo mobile */}
          <div className={`flex-1 ${isChatOpen ? 'block' : 'hidden'} sm:block`}>
            <Chat selectedConversationId={selectedConversationId} onBack={handleBackToChatList} />
          </div>
        </div>
      </CoursesProvider>
    </div>
  );
}
