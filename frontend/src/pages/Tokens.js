import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import AccessModal from '../components/AccessModal';
import { Link, useNavigate } from 'react-router-dom';
import { trackPurchase, trackInitiateCheckout, trackViewContent } from '../utils/metaPixel';

const Tokens = () => {
  const { user, updateUser, refreshUser, loading } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

  // Debug: mostrar estado atual
  console.log('🔍 Tokens: loading =', loading, 'user =', user);

  useEffect(() => {
    // Rastrear visualização da página de tokens
    trackViewContent('tokens_page', 'page');
  }, []);

  // Mostrar loading se ainda estiver carregando
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-zinc-300">Carregando...</p>
        </div>
      </div>
    );
  }

  const tokenPackages = [
    {
      id: 5,
      tokens: 50,
      price: 20.00,
      popular: false
    },
    {
      id: 6,
      tokens: 375,
      price: 50.00,
      popular: true
    },
    {
      id: 7,
      tokens: 500,
      price: 75.00,
      popular: false
    },
    {
      id: 4,
      tokens: 2000,
      price: 180.00,
      popular: false
    }
  ];

  const handlePurchase = (packageData) => {
    // Verificar se o usuário está logado
    if (!user) {
      setShowAccessModal(true);
      return;
    }
    
    // Rastrear início de checkout no Meta Pixel
    trackInitiateCheckout(packageData.price, 'BRL', [`tokens_${packageData.tokens}`]);
    
    setSelectedPackage(packageData);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    // Rastrear compra no Meta Pixel
    trackPurchase(selectedPackage.price, 'BRL', [`tokens_${selectedPackage.tokens}`]);
    
    // Atualizar tokens do usuário
    updateUser({ tokens: user.tokens + selectedPackage.tokens });
    
    setMessage(`✅ Pagamento aprovado! ${selectedPackage.tokens} tokens adicionados à sua conta.`);
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => setMessage(''), 5000);
    
    setShowPaymentModal(false);
    setSelectedPackage(null);
  };

  const handleVipPayment = () => {
    console.log('🚀 Redirecionando para PerfectPay...');
    
    // Rastrear início de checkout no Meta Pixel
    trackInitiateCheckout(49.90, 'BRL', ['vip_upgrade']);
    
    // Redirecionar diretamente para o link do Nitro Pagamentos
    window.open('https://go.nitropagamentos.com/3pbth', '_blank');
    
    // Fechar o modal
    setShowVipModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Header com link Voltar */}
          <div className="flex justify-end items-center mb-6">
            <Link
              to="/"
              className="text-rose-400 hover:text-rose-500 font-medium"
            >
              ← Voltar
            </Link>
          </div>

          {/* Token Info Card */}
          <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 rounded-2xl shadow-lg p-6 mb-6 border border-rose-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">💎</span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{user?.tokens || 0}</p>
                  <p className="text-zinc-400 text-sm">Tokens disponíveis</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={async () => await refreshUser()}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                >
                  🔄 Atualizar
                </button>
                {!user?.isVip && (
                  <button
                    onClick={() => setShowVipModal(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md"
                  >
                    👑 VIP
                  </button>
                )}
            </div>
          </div>
        </div>

          {/* Título principal */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">💎</span>
              </div>
              <h1 className="text-4xl font-bold text-rose-500">
                Borracha de Roupas
              </h1>
            </div>
            <p className="text-zinc-300 text-lg">
              Carregue seus tokens para gerar imagens sensuais
            </p>
          </div>

          {/* Mensagem de feedback */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Seção de compra de tokens */}
          <div className="bg-zinc-900/90 rounded-lg shadow-lg p-8 border border-rose-500/30">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              💰 Compre Tokens
            </h2>
            
            
            <div className="space-y-4">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-zinc-800/50 border-2 rounded-lg p-6 flex items-center justify-between ${
                    pkg.popular 
                      ? 'border-rose-500 shadow-lg' 
                      : 'border-zinc-700 hover:border-rose-500/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ Mais popular
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg font-bold">💎</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {pkg.tokens} tokens
                      </div>
                      <div className="text-lg text-zinc-400">
                        R$ {pkg.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(pkg)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Comprar agora
                  </button>
                </div>
              ))}
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 p-4 bg-rose-950/30 rounded-lg border border-rose-500/20">
              <h3 className="text-lg font-semibold text-rose-400 mb-2">
                💡 Como funciona?
              </h3>
              <ul className="text-zinc-300 space-y-1">
                <li>• Cada processamento de imagem consome 25 tokens</li>
                <li>• Os tokens não expiram</li>
                <li>• Pagamento seguro via PIX</li>
                <li>• Tokens creditados instantaneamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPackage(null);
          }}
          packageData={selectedPackage}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Modal de Acesso */}
      <AccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        title="Acesso Necessário"
        message="Você precisa fazer login para comprar tokens"
        redirectTo="/tokens"
      />

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full p-6 border-2 border-rose-500/50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👑</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Upgrade para VIP
              </h2>
              <p className="text-zinc-300">
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
                <span className="text-zinc-200">Acesso a todos os recursos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-zinc-200">Processamento ilimitado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-zinc-200">Suporte prioritário</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-rose-500 mb-1">
                R$ 49,90
              </div>
              <div className="text-zinc-400 text-sm">
                Pagamento único
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleVipPayment}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                💰 Comprar VIP Agora
              </button>
              <button
                onClick={() => setShowVipModal(false)}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tokens;
