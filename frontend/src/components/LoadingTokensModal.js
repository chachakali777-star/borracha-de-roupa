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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full p-8 border-2 border-rose-500/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            💎 Carregando Tokens
          </h2>
          
          {/* Countdown */}
          <div className="bg-rose-950/30 rounded-lg p-3 mb-4 border border-rose-500/20">
            <p className="text-rose-400 text-sm font-medium">
              Redirecionando em: <span className="font-bold text-lg">{countdown}s</span>
            </p>
          </div>
          
          {/* Botão de teste */}
          <button
            onClick={() => {
              console.log('🧪 Teste manual: Redirecionando para /tokens...');
              window.location.href = '/tokens';
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Teste: Ir para Tokens
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoadingTokensModal;
