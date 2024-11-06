// components/students/SidechatStudent.tsx
import { useEffect, useState } from 'react';
import { Add } from 'iconsax-react';
import ModalNovaConversa from './modal-novaconversa';
import { useAuth } from '@/app/components/context/AuthContext';

interface Conversation {
  id: number;
  name: string;
  preview: string;
  unread: number;
}

export default function SidechatStudent({ onSelectConversation }: { onSelectConversation: (id: number) => void }) {
  const { userId: loggedInUserId, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchConversations = async () => {
    if (!loggedInUserId) return;

    try {
      const response = await fetch(`/api/conversations/getConversations?userId=${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchConversations();
    }
  }, [loggedInUserId, loading]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelectConversation(id);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchConversations(); // Atualiza as conversas ao fechar o modal
  };

  return (
    <div className="w-full sm:w-80 bg-white shadow-lg h-full p-6 border-r border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Conversas</h2>
        <button onClick={handleOpenModal} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <Add size="20" />
        </button>
      </div>
      <ul className="space-y-3">
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            onClick={() => handleSelect(conversation.id)}
            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${selectedId === conversation.id ? 'bg-verdeAgua' : 'bg-gray-100'} hover:bg-verdeAgua hover:text-black transition`}
          >
            <div>
              <p className="font-semibold">{conversation.name}</p>
              <p className="text-sm text-gray-500">{conversation.preview}</p>
            </div>
            {conversation.unread > 0 && (
              <span className="bg-verde text-white text-xs font-bold px-2 py-1 rounded-full">
                {conversation.unread}
              </span>
            )}
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <ModalNovaConversa onClose={handleCloseModal} onSelectConversation={handleSelect} />
      )}
    </div>
  );
}
