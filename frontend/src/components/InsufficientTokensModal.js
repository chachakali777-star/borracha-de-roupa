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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-2 border-pink-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tokens Insuficientes
          </h2>
          <p className="text-gray-600">
            Você não possui tokens suficientes para gerar uma imagem
          </p>
        </div>

        {/* Token Info */}
        <div className="bg-pink-50 rounded-xl p-4 mb-6 border border-pink-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Tokens necessários:</span>
            <span className="text-red-500 font-bold">{requiredTokens}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Tokens disponíveis:</span>
            <span className="text-gray-600 font-bold">{currentTokens}</span>
          </div>
          <div className="border-t border-pink-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Faltam:</span>
              <span className="text-red-500 font-bold">{requiredTokens - currentTokens}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-pink-100 rounded-lg p-4 mb-6 border border-pink-200">
          <h4 className="font-semibold text-gray-800 mb-3">💎 Com tokens você pode:</h4>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Gerar imagens com IA
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Experimentar roupas virtualmente
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Baixar resultados em alta qualidade
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Acessar recursos premium
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAcquireTokens}
            className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            💰 Adquirir Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientTokensModal;
