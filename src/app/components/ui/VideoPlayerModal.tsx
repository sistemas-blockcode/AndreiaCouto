'use client';
import { useEffect } from 'react';

interface VideoPlayerModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ videoUrl, isOpen, onClose }: VideoPlayerModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300 ease-in-out">
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-3xl p-4 transform transition-transform duration-300 ease-out scale-100 hover:scale-105">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 ease-in-out"
          aria-label="Fechar"
        >
          <span className="text-2xl">&times;</span>
        </button>
        <video controls className="w-full h-auto rounded-lg shadow-md border border-gray-200">
          <source src={videoUrl} type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
    </div>
  );
}
