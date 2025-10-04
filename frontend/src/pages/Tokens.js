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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Header com tokens disponíveis */}
          <div className="flex justify-between items-center mb-6">
            <div className="bg-zinc-900/90 rounded-lg px-4 py-3 shadow-lg flex items-center border border-rose-500/30">
              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">💎</span>
              </div>
              <span className="text-white font-medium">
                {user ? `${user.tokens || 0} tokens disponíveis` : 'Faça login para ver seus tokens'}
              </span>
              {user && (
                <button
                  onClick={async () => await refreshUser()}
                  className="ml-3 bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-sm transition-colors"
                  title="Atualizar tokens"
                >
                  🔄
                </button>
              )}
            </div>
            <Link
              to="/"
              className="text-rose-400 hover:text-rose-500 font-medium"
            >
              ← Voltar
            </Link>
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
    </div>
  );
};

export default Tokens;
