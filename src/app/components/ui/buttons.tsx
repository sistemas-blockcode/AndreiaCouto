'use client';

import { useState } from 'react';
import ModalCursos from './modal-cursos';
import ModalAdicionarAluno from './modal-alunos';
import ModalAdicionarAdmin from './modal-admin'; 


interface ButtonsProps {
  title: string;
  type: 'CURSO' | 'ALUNO' | 'ADMIN'; // Prop para definir o tipo de modal
}

export default function Buttons({ title, type }: ButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal} 
        className="mb-4 px-3 py-2 font-semibold text-xs text-white bg-rosaVibrante rounded-lg"
      >
        {title}
      </button>

      {/* Renderiza o modal de acordo com o tipo recebido */}
      {isModalOpen && type === 'CURSO' && <ModalCursos onClose={handleCloseModal} />}
      {isModalOpen && type === 'ALUNO' && <ModalAdicionarAluno onClose={handleCloseModal} />}
      {isModalOpen && type === 'ADMIN' && <ModalAdicionarAdmin onClose={handleCloseModal} />}

    </div>
  );
}
