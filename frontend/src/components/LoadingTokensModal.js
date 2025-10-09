import React, { useEffect, useState } from 'react';

const LoadingTokensModal = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    console.log('🔄 LoadingTokensModal: Modal aberto, iniciando countdown...');
    
    // Reset countdown when modal opens
    setCountdown(5);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        console.log(`⏰ Countdown: ${prev - 1}s`);
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimeout = setTimeout(() => {
      console.log('🚀 LoadingTokensModal: Executando redirecionamento...');
      
      // Fechar o modal primeiro
      onClose();
      
      // Redirecionar imediatamente
      console.log('🌐 Redirecionando para /tokens...');
      window.location.href = '/tokens';
    }, 5000);

    return () => {
      console.log('🧹 LoadingTokensModal: Limpando timers...');
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border-2 border-pink-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            💎 Carregando Tokens
          </h2>
          
          {/* Countdown */}
          <div className="bg-pink-100 rounded-lg p-3 mb-4 border border-pink-200">
            <p className="text-pink-600 text-sm font-medium">
              Redirecionando em: <span className="font-bold text-lg">{countdown}s</span>
            </p>
          </div>
          
          {/* Botão de teste */}
          <button
            onClick={() => {
              console.log('🧪 Teste manual: Redirecionando para /tokens...');
              window.location.href = '/tokens';
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Teste: Ir para Tokens
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoadingTokensModal;
