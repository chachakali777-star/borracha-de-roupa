import React from 'react';
import { useNavigate } from 'react-router-dom';

const InsufficientTokensModal = ({ isOpen, onClose, requiredTokens, currentTokens }) => {
  const navigate = useNavigate();

  const handleAcquireTokens = () => {
    navigate('/tokens');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full p-6 border-2 border-rose-500/50">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Tokens Insuficientes
          </h2>
          <p className="text-zinc-300">
            Você não possui tokens suficientes para gerar uma imagem
          </p>
        </div>

        {/* Token Info */}
        <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-300 font-medium">Tokens necessários:</span>
            <span className="text-red-400 font-bold">{requiredTokens}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-300 font-medium">Tokens disponíveis:</span>
            <span className="text-zinc-400 font-bold">{currentTokens}</span>
          </div>
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-zinc-300 font-medium">Faltam:</span>
              <span className="text-red-400 font-bold">{requiredTokens - currentTokens}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-rose-950/30 to-purple-950/30 rounded-lg p-4 mb-6 border border-rose-500/20">
          <h4 className="font-semibold text-white mb-3">💎 Com tokens você pode:</h4>
          <ul className="text-left space-y-2 text-zinc-200">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Gerar imagens com IA
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Experimentar roupas virtualmente
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Baixar resultados em alta qualidade
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Acessar recursos premium
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAcquireTokens}
            className="flex-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            💰 Adquirir Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientTokensModal;
