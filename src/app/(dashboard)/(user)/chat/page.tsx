'use client';
import Sidebar from "@/app/components/students/sidebar";
import SidechatStudent from "@/app/components/students/sidechat";
import ChatStudent from "@/app/components/students/chat";
import { AuthProvider, useAuth } from '@/app/components/context/AuthContext';
import { useState, useEffect } from 'react';

interface Conversation {
  id: number;
  name: string;
  preview: string;
}

export default function ChatPageStudent() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedContactName, setSelectedContactName] = useState<string>(''); // Novo estado para o nome do contato
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Usando o contexto de autenticação para obter o ID do usuário logado
  const { userId: loggedInUserId, loading } = useAuth();

  // Função para buscar as conversas
  const fetchConversations = async () => {
    if (!loggedInUserId) return;

    try {
      const response = await fetch(`/api/conversations/getConversations?userId=${loggedInUserId}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchConversations();
    }
  }, [loggedInUserId, loading]);

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    setIsChatOpen(true);

    // Encontrar o nome do contato para a conversa selecionada
    const selectedConversation = conversations.find((conv) => conv.id === id);
    if (selectedConversation) {
      setSelectedContactName(selectedConversation.name);
    }
  };

  const handleBackToChatList = () => {
    setIsChatOpen(false);
  };

  return (  
    <div className="flex h-screen">
      <AuthProvider>
        <div className="flex flex-1">
          <div className={`w-full sm:w-80 ${isChatOpen ? 'hidden sm:block' : ''}`}>
            <SidechatStudent onSelectConversation={handleSelectConversation} />
          </div>
          
          <div className={`flex-1 ${isChatOpen ? 'block' : 'hidden'} sm:block`}>
            <ChatStudent
              selectedConversationId={selectedConversationId}
              onBack={handleBackToChatList}
              contactName={selectedContactName} // Passa o nome do contato selecionado
            />
          </div>
        </div>
      </AuthProvider>
    </div>
  );
}
