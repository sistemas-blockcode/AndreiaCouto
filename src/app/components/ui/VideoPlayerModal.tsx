// components/VideoPlayerModal.tsx
'use client';
import React from 'react';

interface VideoPlayerModalProps {
  videoUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ videoUrl, isOpen, onClose }: VideoPlayerModalProps) {
  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-[90%] max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-auto rounded-md shadow-md bg-gray-900"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
    </div>
  );
}
