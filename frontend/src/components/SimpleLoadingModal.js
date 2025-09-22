import React, { useEffect } from 'react';

const SimpleLoadingModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    console.log('🔄 SimpleLoadingModal: Iniciando...');

    const timer = setTimeout(() => {
      console.log('🚀 SimpleLoadingModal: Redirecionando...');
      window.location.href = '/tokens';
    }, 3000); // 3 segundos para teste

    return () => {
      console.log('🧹 SimpleLoadingModal: Limpando...');
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Carregando Tokens
        </h2>
        <button
          onClick={() => {
            console.log('🧪 Teste: Redirecionando agora...');
            window.location.href = '/tokens';
          }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Ir para Tokens Agora
        </button>
      </div>
    </div>
  );
};

export default SimpleLoadingModal;
