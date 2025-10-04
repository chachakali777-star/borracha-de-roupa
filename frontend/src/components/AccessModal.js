import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessModal = ({ isOpen, onClose, title = "Acesso Necessário", message = "Você precisa fazer login para continuar", redirectTo = "/" }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate(`/register?redirect=${encodeURIComponent(redirectTo)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full p-6 border-2 border-rose-500/50">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-300">{message}</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-zinc-200">Acesso completo à plataforma</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-zinc-200">Compra de tokens</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-zinc-200">Geração de imagens com IA</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleRegister} 
            className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            🚀 Criar Conta Gratuita
          </button>
          <button 
            onClick={handleLogin} 
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            🔑 Fazer Login
          </button>
          <button 
            onClick={onClose} 
            className="w-full text-zinc-400 hover:text-zinc-200 font-medium py-2 px-6 rounded-xl transition-all duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
