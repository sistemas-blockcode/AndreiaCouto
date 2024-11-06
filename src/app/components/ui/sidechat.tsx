import { useState } from 'react';
import { Add } from 'iconsax-react';
import ModalNovaConversa from './modal-novaconversa';

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

interface SidechatProps {
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
  fetchConversations: () => void;
  adminId: number;
}

export default function Sidechat({ conversations, onSelectConversation, fetchConversations, adminId }: SidechatProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelectConversation(id);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
              selectedId === conversation.id ? 'bg-verdeAgua' : 'bg-gray-100'
            } hover:bg-verdeAgua hover:text-black transition`}
          >
            <div>
              <p className="font-semibold">
                {conversation.participantA.id === adminId ? conversation.participantB.name : conversation.participantA.name}
              </p>
              <p className="text-sm text-gray-500">
                {conversation.messages[0]?.text || 'Sem mensagens ainda'}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <ModalNovaConversa
          onClose={handleCloseModal}
          onSelectConversation={handleSelect}
          adminId={adminId}
          fetchConversations={fetchConversations}
        />
      )}
    </div>
  );
}
