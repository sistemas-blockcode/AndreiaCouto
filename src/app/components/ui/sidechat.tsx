// components/ui/sidechat.tsx
'use client';
import { useState } from 'react';
import { Add } from 'iconsax-react';
import ModalNovaConversa from './modal-novaconversa';

const conversations = [
  { id: 1, name: 'João Silva', preview: 'Maria: Olá, tudo bem?', unread: 0 },
  { id: 2, name: 'Maria Oliveira', preview: 'Inicie a conversa!', unread: 0 },
  { id: 3, name: 'Grupo Teste', preview: 'Pedro: Olá, pessoal!', unread: 5 },
];

export default function Sidechat({ onSelectConversation }: { onSelectConversation: (id: number) => void }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/fechar o modal

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelectConversation(id);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
              selectedId === conversation.id ? 'bg-verdeAgua' : 'bg-gray-100'
            } hover:bg-verdeAgua hover:text-black transition`}
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

      {/* Exibir o modal se isModalOpen for true */}
      {isModalOpen && <ModalNovaConversa onClose={handleCloseModal} />}
    </div>
  );
}
