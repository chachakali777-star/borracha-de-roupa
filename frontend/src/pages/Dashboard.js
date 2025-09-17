import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Dashboard = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      const response = await api.get('/users/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = useCallback(async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  }, [refreshUser]);

  useEffect(() => {
    refreshUserData();
    
    // Refresh automático a cada 30 segundos
    const interval = setInterval(refreshUserData, 30000);
    
    return () => clearInterval(interval);
  }, [refreshUserData]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.1) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Bem-vindo ao Futuro da Moda! 👗✨
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experimente roupas virtualmente com nossa IA revolucionária. 
              Veja como você ficaria com qualquer peça antes de comprar!
            </p>
          </div>

          {/* Token Card */}
          <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 mb-8 shadow-2xl">
            {/* Botões para Mobile - Acima do título */}
            <div className="flex gap-3 mb-6 md:hidden">
              <button
                onClick={refreshUserData}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
                title="Atualizar tokens"
              >
                🔄 Atualizar
              </button>
              <a
                href="/tokens"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                💰 Carregar Tokens
              </a>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  💎 Seus Tokens
                </h2>
                <p className="text-gray-400">
                  Criptomoeda para experimentar roupas virtualmente
                </p>
              </div>
              {/* Botões para Desktop - Escondidos no mobile */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={refreshUserData}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
                  title="Atualizar tokens"
                >
                  🔄 Atualizar
                </button>
                <a
                  href="/tokens"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  💰 Carregar Tokens
                </a>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {user?.tokens || 0}
              </div>
              <p className="text-gray-300 text-lg mb-4">
                Tokens disponíveis para experimentar roupas (25 tokens por experimento)
              </p>
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Powered by Borracha de Roupa IA</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Como Funciona?
                </h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-sm">1</span>
                  </div>
                  <span>Faça upload de uma foto sua</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-sm">2</span>
                  </div>
                  <span>Escolha a roupa que deseja experimentar</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-sm">3</span>
                  </div>
                  <span>IA processa e gera o resultado</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-sm">4</span>
                  </div>
                  <span>Veja como você ficaria!</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👕</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Tipos de Roupas
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Camisetas', 'Vestidos', 'Calças', 'Blusas', 'Jaquetas', 'E muito mais!'].map((item, index) => (
                  <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-12">
            <a
              href="/upload"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="mr-2">🚀</span>
              Começar a Experimentar Agora
              <span className="ml-2">✨</span>
            </a>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                📊 Seu Histórico de Atividades
              </h2>
              <div className="space-y-4">
                {history.slice(0, 10).map((item) => (
                  <div key={item.id} className="bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:bg-black/40 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          {item.descricao}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(item.data).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                        {item.tipo_acao}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
