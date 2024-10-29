
import { useState, useEffect } from 'react';
import { Settings, ArrowLeft, Send } from 'iconsax-react';

type Message = {
  sender: string;
  text: string;
};

type Messages = {
  [key: number]: Message[];
};

const messages: Messages = {
  1: [
    { sender: 'João Silva', text: 'Oi, como você está?' },
    { sender: 'Você', text: 'Estou bem, e você?' },
  ],
  2: [
    { sender: 'Maria Oliveira', text: 'Vamos começar o projeto?' },
    { sender: 'Você', text: 'Sim, quando você pode?' },
  ],
  3: [
    { sender: 'Grupo Teste', text: 'Boa tarde, pessoal!' },
    { sender: 'Você', text: 'Boa tarde!' },
  ],
};

// Permitir que selectedConversationId seja number ou null
export default function Chat({ selectedConversationId, onBack }: { selectedConversationId: number | null, onBack: () => void }) {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedConversationId) {
      setChatMessages(messages[selectedConversationId] || []);
    }
  }, [selectedConversationId]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Cabeçalho da Conversa */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center">
          {/* Botão de voltar visível apenas em telas pequenas */}
          <button className="sm:hidden mr-3 text-verde" onClick={onBack}>
            <ArrowLeft size="25" className="cursor pointer hover:text-verde"/>
          </button>
          <span className="h-10 w-10 bg-verde text-white rounded-full flex items-center justify-center mr-3">J</span>
          <h2 className="text-lg font-semibold">Nome do Contato</h2>
        </div>
        <div className="flex space-x-3 text-gray-600">
          <Settings size="25" className="cursor-pointer hover:text-verde" />
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 bg-white shadow-md rounded-lg overflow-y-auto space-y-4">
        {chatMessages.map((message, index) => (
          <div key={index} className={`p-3 rounded-lg ${message.sender === 'Você' ? 'bg-verde text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>
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
            className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Digite sua mensagem..."
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
            <button className="flex px-4 py-[13px] -mr-5 bg-verde hover:bg-verdeAgua rounded text-white text-sm">Enviar <Send size="20" className="cursor-pointer ml-2" /> </button>
          </div>
        </div>
      </div>
    </div>
  );
}
