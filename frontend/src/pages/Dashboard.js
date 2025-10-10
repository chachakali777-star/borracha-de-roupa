import React, { useEffect, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import AccessModal from '../components/AccessModal';
import InsufficientTokensModal from '../components/InsufficientTokensModal';
import LoadingTokensModal from '../components/LoadingTokensModal';
import SimpleLoadingModal from '../components/SimpleLoadingModal';
import { trackViewContent, trackAddToCart, trackInitiateCheckout } from '../utils/metaPixel';
import NSFWBadge from '../components/NSFWBadge';
import NSFWBlurImage from '../components/NSFWBlurImage';

const Dashboard = () => {
  const { user, refreshUser, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVipModal, setShowVipModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showInsufficientTokensModal, setShowInsufficientTokensModal] = useState(false);
  const [showLoadingTokensModal, setShowLoadingTokensModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
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
    
    // Rastrear início de checkout no Meta Pixel
    trackInitiateCheckout(49.90, 'BRL', ['vip_upgrade']);
    
    // Rastrear adição ao carrinho no Meta Pixel
    trackAddToCart(49.90, 'BRL', 'vip_upgrade');
    
    // Redirecionar diretamente para o link do Nitro Pagamentos
    window.open('https://go.nitropagamentos.com/3pbth', '_blank');
    
    // Fechar o modal
    setShowVipModal(false);
  };

  const handleCategoryClick = (category) => {
    // Se a categoria requer login e o usuário não está logado
    if (category.requiresLogin && !isLoggedIn) {
      setSelectedCategory(category);
      setShowAccessModal(true);
      return;
    }
    
    // Se a categoria requer login e o usuário está logado, sempre mostrar modal VIP
    if (category.requiresLogin && isLoggedIn) {
      // Rastrear visualização de conteúdo premium
      trackViewContent(category.id, 'premium_content');
      
      // Sempre mostrar modal VIP para cards menores (não verificar tokens)
      setShowVipModal(true);
      return;
    }
    
    // Se a categoria não requer login, executar ação diretamente
    // Rastrear visualização de conteúdo gratuito
    trackViewContent(category.id, 'free_content');
    category.action();
  };



  useEffect(() => {
    // Rastrear visualização da página principal
    trackViewContent('dashboard', 'page');
    
    // Verificar se há parâmetro vip=true na URL
    if (searchParams.get('vip') === 'true') {
      setShowVipModal(true);
      // Remover o parâmetro da URL
      searchParams.delete('vip');
      setSearchParams(searchParams);
    }
    
    // Só executa refresh se o usuário estiver logado
    if (isLoggedIn) {
    refreshUserData();
    
    // Refresh automático a cada 30 segundos
    const interval = setInterval(refreshUserData, 30000);
    
    return () => clearInterval(interval);
    }
  }, [refreshUserData, isLoggedIn, searchParams, setSearchParams]);

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
      action: () => navigate('/undress')
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
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pt-20">
        {/* Mensagem de boas-vindas para usuários não logados */}
        {!isLoggedIn && (
          <div className="bg-pink-100 text-gray-800 rounded-2xl p-4 mb-6 text-center border border-pink-200">
            <h2 className="text-lg font-bold mb-2 text-pink-600">✨ Bem-vindo ao Borracha de Roupas!</h2>
            <p className="text-sm mb-3 text-gray-600">
              Explore nossa plataforma de IA para experimentar roupas virtualmente
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors"
              >
                Criar Conta
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-pink-200 text-pink-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-300 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}

        {/* Token Info Card */}
        <div className="bg-pink-100 rounded-2xl shadow-lg p-6 mb-6 border border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">💎</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600">{user?.tokens || 0}</p>
                <p className="text-gray-600 text-sm">Tokens disponíveis</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={() => setShowSimpleModal(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
              >
                + Comprar
              </button>
              {!user?.isVip && (
                <button
                  onClick={() => setShowVipModal(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md"
                >
                  👑 VIP
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Featured Card - Trocar roupa */}
        <div className="mb-6">
          <div
            onClick={() => handleCategoryClick(categories[0])}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl border border-pink-200"
          >
            {/* Featured Image */}
            <div 
              className="relative bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center"
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
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">18+</span>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-base font-bold">
                  ⭐ Popular
              </div>
              </div>
            </div>

            {/* Featured Info */}
            <div className="p-4 text-center bg-white">
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
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl relative border border-pink-200"
            >
              {/* Media Content */}
              <div className="relative h-32 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                <NSFWBadge />
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
          </div>

                {/* Category Info */}
                <div className="p-3 bg-white">
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
            
      </div>

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-2 border-pink-200">
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
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Acesso a todos os recursos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  </div>
                <span className="text-gray-700">Processamento ilimitado</span>
                  </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
              <div className="text-gray-600 text-sm">
                Pagamento único
                    </div>
                  </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleVipPayment}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                💰 Comprar VIP Agora
              </button>
              <button
                onClick={() => setShowVipModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
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

      {/* Modal de Tokens Insuficientes */}
      <InsufficientTokensModal
        isOpen={showInsufficientTokensModal}
        onClose={() => setShowInsufficientTokensModal(false)}
        requiredTokens={26}
        currentTokens={user?.tokens || 0}
      />

      {/* Modal de Carregamento de Tokens */}
      <LoadingTokensModal
        isOpen={showLoadingTokensModal}
        onClose={() => setShowLoadingTokensModal(false)}
      />

      {/* Modal Simples para Teste */}
      <SimpleLoadingModal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
      />
    </div>
  );
};

export default Dashboard;
