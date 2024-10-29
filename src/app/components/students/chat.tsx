import { useState, useEffect } from 'react';
import { Settings, ArrowLeft, Send } from 'iconsax-react';
import { useAuth } from '@/app/components/context/AuthContext';
import useSocket from '@/hooks/useSocket';

type Message = {
  sender: string;
  text: string;
};

export default function Chat({ selectedConversationId, onBack }: { selectedConversationId: number | null, onBack: () => void }) {
  const { userId: loggedInUserId, loading } = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !selectedConversationId) return;

    socket.emit('joinChat', selectedConversationId);

    socket.on('receiveMessage', ({ message, senderId }) => {
      setChatMessages((prevMessages) => [...prevMessages, { sender: senderId === loggedInUserId ? 'Você' : senderId.toString(), text: message }]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, selectedConversationId, loggedInUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !loggedInUserId || !socket) return;

    const response = await fetch('/api/messages/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: selectedConversationId,
        senderId: loggedInUserId,
        text: newMessage,
      }),
    });

    if (response.ok) {
      const message = await response.json();
      setChatMessages((prevMessages) => [...prevMessages, message]);

      socket.emit('sendMessage', {
        chatId: selectedConversationId,
        message: newMessage,
        senderId: loggedInUserId
      });

      setNewMessage('');
    }
  };

  if (loading) return <p>Carregando mensagens...</p>;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 p-4 bg-white shadow-md rounded-lg overflow-y-auto space-y-4">
        {chatMessages.map((message, index) => (
          <div key={index} className={`p-3 rounded-lg ${message.sender === 'Você' ? 'bg-verde text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>
            <p className="font-semibold">{message.sender}</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-100 border-t flex">
        <input
          type="text"
          className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:outline-none"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage} className="flex items-center px-4 bg-verde hover:bg-verdeAgua rounded text-white">
          Enviar <Send size="20" className="ml-2" />
        </button>
      </div>
    </div>
  );
}
