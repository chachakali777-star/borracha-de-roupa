import React, { useEffect, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AccessModal from '../components/AccessModal';

const Dashboard = () => {
  const { user, refreshUser, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [showVipModal, setShowVipModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Debug: mostrar estado atual
  console.log('🔍 Dashboard: loading =', loading, 'isLoggedIn =', isLoggedIn, 'user =', user);

  const refreshUserData = useCallback(async () => {
    // Só tenta atualizar se o usuário estiver logado
    if (!isLoggedIn) return;
    
    try {
      await refreshUser();
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  }, [refreshUser, isLoggedIn]);

  const handleVipPayment = () => {
    console.log('🚀 Redirecionando para PerfectPay...');
    window.open('https://checkout.perfectpay.com.br/pay/PPU38CQ11JB', '_blank');
    setShowVipModal(false);
  };

  const handleCategoryClick = (category) => {
    // Se a categoria requer login e o usuário não está logado
    if (category.requiresLogin && !isLoggedIn) {
      setSelectedCategory(category);
      setShowAccessModal(true);
      return;
    }
    
    // Se o usuário está logado ou a categoria não requer login, executar ação
    category.action();
  };



  useEffect(() => {
    // Só executa refresh se o usuário estiver logado
    if (isLoggedIn) {
      refreshUserData();
      
      // Refresh automático a cada 30 segundos
      const interval = setInterval(refreshUserData, 30000);
      
      return () => clearInterval(interval);
    }
  }, [refreshUserData, isLoggedIn]);

  const categories = [
    {
      id: 1,
      title: "Trocar roupa",
      description: "Experimente roupas virtualmente",
      image: `${process.env.PUBLIC_URL}/img/MainImage.webp`,
      requiresLogin: false,
      action: () => navigate('/upload')
    },
    {
      id: 2,
      title: "Despir",
      description: "Remover roupas das fotos",
      image: `${process.env.PUBLIC_URL}/img/1.jpeg`,
      requiresLogin: true,
      action: () => navigate('/upload')
    },
    {
      id: 3,
      title: "Ações sexuais e fluidos",
      description: "Conteúdo adulto avançado",
      image: `${process.env.PUBLIC_URL}/img/2.jpeg`,
      requiresLogin: true,
      action: () => navigate('/upload')
    },
    {
      id: 4,
      title: "Despir Animar",
      description: "Animações de despir",
      video: `${process.env.PUBLIC_URL}/img/3.mp4`,
      requiresLogin: true,
      action: () => navigate('/upload')
    },
    {
      id: 5,
      title: "Posições Diversas",
      description: "Diferentes posições e poses",
      video: `${process.env.PUBLIC_URL}/img/4.mp4`,
      requiresLogin: true,
      action: () => navigate('/upload')
    }
  ];

  // Mostrar loading se ainda estiver carregando
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          {/* Title */}
          <h1 className="text-2xl font-bold text-pink-500">
            Borracha de Roupas
          </h1>
          
          {/* Tokens Display */}
          <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
            💎 {isLoggedIn ? (user?.tokens || 0) : 'Faça login'}
          </div>
      </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Mensagem de boas-vindas para usuários não logados */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 mb-6 text-center">
            <h2 className="text-lg font-bold mb-2">✨ Bem-vindo ao Borracha de Roupas!</h2>
            <p className="text-sm opacity-90 mb-3">
              Explore nossa plataforma de IA para experimentar roupas virtualmente
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Criar Conta
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
        
        {/* Featured Card - Trocar roupa */}
        <div className="mb-6">
          <div
            onClick={() => handleCategoryClick(categories[0])}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            {/* Featured Image */}
            <div 
              className="relative bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center"
              style={{ 
                height: '320px', 
                minHeight: '320px'
              }}
            >
              <img 
                src={categories[0].image} 
                alt="Trocar roupa" 
                className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👗</span>
            </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-base font-bold">
                  ⭐ Popular
              </div>
              </div>
            </div>

            {/* Featured Info */}
            <div className="p-4 text-center">
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {categories[0].title}
              </h3>
              <p className="text-gray-600 text-sm">
                {categories[0].description}
                </p>
              </div>
              </div>
          </div>

        {/* Other Categories Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.slice(1).map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl relative"
            >
              {/* Media Content */}
              <div className="relative h-32 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                  />
                ) : category.video ? (
                  <video 
                    src={category.video} 
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/20 rounded-t-2xl"></div>
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">👗</span>
              </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
              </div>
            </div>
            </div>

              {/* Category Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-center mb-1 text-sm">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-xs text-center">
                  {category.description}
                </p>
              </div>
                </div>
                ))}
              </div>

        {/* Token Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl">💎</span>
                  </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{user?.tokens || 0}</p>
                <p className="text-gray-600 text-sm">Tokens disponíveis</p>
                  </div>
                  </div>
            <p className="text-gray-600 text-sm mb-4">
              Cada processamento consome 25 tokens
            </p>
                <button
              onClick={() => navigate('/tokens')}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  💰 Carregar Tokens
            </button>
              </div>
            </div>
            
        {/* Spacer for bottom navigation */}
        <div className="mb-20"></div>
                </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-center space-x-8">
            {/* Ver Conta */}
            <button
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-pink-500 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Ver Conta</span>
            </button>

            {/* Início */}
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center space-y-1 text-pink-500"
            >
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <svg fill="white" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">Início</span>
            </button>
              </div>
            </div>
          </div>

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            {/* Header */}
              <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👑</span>
          </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Upgrade para VIP
              </h2>
              <p className="text-gray-600">
                Desbloqueie todos os recursos premium
                        </p>
                      </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Acesso a todos os recursos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  </div>
                <span className="text-gray-700">Processamento ilimitado</span>
                  </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  </div>
                <span className="text-gray-700">Suporte prioritário</span>
                  </div>
            </div>
            
            {/* Price */}
              <div className="text-center mb-6">
              <div className="text-3xl font-bold text-pink-600 mb-1">
                R$ 49,90
                </div>
              <div className="text-gray-500 text-sm">
                Pagamento único
              </div>
                  </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleVipPayment}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                💰 Comprar VIP Agora
              </button>
              <button
                onClick={() => setShowVipModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
              </div>
            </div>
          </div>
          )}

      {/* VIP Modal Simplificado */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  🔓 Desbloquear VIP
                </h2>
                <button
                  onClick={() => setShowVipModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Conteúdo do VIP */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl">👑</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Upgrade para VIP Premium
                </h3>
                
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Desbloqueie recursos exclusivos:</h4>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Todas as categorias liberadas
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Conteúdo adulto premium
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Tokens ilimitados
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Suporte prioritário
                    </li>
                  </ul>
                </div>

                <div className="bg-pink-50 rounded-lg p-4 mb-6">
                  <div className="text-3xl font-bold text-pink-600 mb-1">R$ 49,90</div>
                  <div className="text-gray-600">Pagamento único</div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVipModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVipPayment}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  🚀 Comprar VIP Agora
                </button>
              </div>
        </div>
      </div>
        </div>
      )}

      {/* Modal de Acesso */}
      <AccessModal
        isOpen={showAccessModal}
        onClose={() => {
          setShowAccessModal(false);
          setSelectedCategory(null);
        }}
        title="Acesso Necessário"
        message={`Você precisa fazer login para acessar "${selectedCategory?.title}"`}
        redirectTo="/upload"
      />
    </div>
  );
};

export default Dashboard;
