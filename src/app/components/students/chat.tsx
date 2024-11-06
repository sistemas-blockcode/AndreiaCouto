// components/students/ChatStudent.tsx
'use client';
import { useState, useEffect } from 'react';
import { Settings, ArrowLeft, Send } from 'iconsax-react';
import { useAuth } from '@/app/components/context/AuthContext';
import useSocket from '@/hooks/useSocket';

type Message = {
  id: number;
  sender: string;
  text: string;
  createdAt: string;
};

interface ChatProps {
  selectedConversationId: number | null;
  onBack: () => void;
  contactName: string;
}

export default function ChatStudent({ selectedConversationId, onBack, contactName }: ChatProps) {
  const { userId: loggedInUserId, loading } = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();

  // Entrar na sala do WebSocket
  useEffect(() => {
    if (selectedConversationId && socket) {
      socket.emit('joinChat', selectedConversationId.toString());
    }
  }, [selectedConversationId, socket]);

  // Buscar mensagens da conversa selecionada
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversationId) {
        const response = await fetch(`/api/conversations/${selectedConversationId}/messages`);
        const messages = await response.json();
        setChatMessages(messages);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  // Escutar mensagens recebidas pelo WebSocket
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message: Message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receiveMessage');
      }
    };
  }, [socket]);

  // Enviar mensagem
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversationId && loggedInUserId) {
      const messageData = {
        conversationId: selectedConversationId,
        senderId: loggedInUserId,
        text: newMessage,
      };

      // Emitir a mensagem via WebSocket
      socket?.emit('sendMessage', messageData);

      // Adicionar a mensagem à lista localmente (atualização otimista)
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), sender: 'Você', text: newMessage, createdAt: new Date().toISOString() },
      ]);

      setNewMessage('');
    }
  };

  if (loading) return <p>Carregando mensagens...</p>;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Cabeçalho da Conversa */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center">
          <button className="sm:hidden mr-3 text-verde" onClick={onBack}>
            <ArrowLeft size="25" className="cursor-pointer hover:text-verde" />
          </button>
          <span className="h-10 w-10 bg-verde text-white rounded-full flex items-center justify-center mr-3">
            {contactName.charAt(0)}
          </span>
          <h2 className="text-lg font-semibold">{contactName}</h2>
        </div>
        <div className="flex space-x-3 text-gray-600">
          <Settings size="25" className="cursor-pointer hover:text-verde" />
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 bg-white shadow-md rounded-lg overflow-y-auto space-y-4">
        {chatMessages.map((message) => (
          <div key={message.id} className={`p-3 rounded-lg ${message.sender === 'Você' ? 'bg-verde text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>
            <p className="font-semibold">{message.sender}</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      {/* Campo de Entrada de Mensagem */}
      <div className="p-4 bg-gray-100 border-t flex">
        <div className="relative w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Digite sua mensagem..."
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
            <button onClick={handleSendMessage} className="flex px-4 py-[13px] -mr-5 bg-verde hover:bg-verdeAgua rounded text-white text-sm">
              Enviar <Send size="20" className="cursor-pointer ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
