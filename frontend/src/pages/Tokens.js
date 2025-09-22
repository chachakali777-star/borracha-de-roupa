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
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const tokenPackages = [
    {
      id: 5,
      tokens: 50,
      price: 20.00,
      popular: true
    },
    {
      id: 6,
      tokens: 375,
      price: 50.00,
      popular: false
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
    <div className="min-h-screen bg-pink-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Header com tokens disponíveis */}
          <div className="flex justify-between items-center mb-6">
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm flex items-center">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="text-gray-700 font-medium">
                {user ? `${user.tokens || 0} tokens disponíveis` : 'Faça login para ver seus tokens'}
              </span>
              {user && (
                <button
                  onClick={async () => await refreshUser()}
                  className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition-colors"
                  title="Atualizar tokens"
                >
                  🔄
                </button>
              )}
            </div>
            <Link
              to="/"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              ← Voltar
            </Link>
          </div>

          {/* Título principal */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">T</span>
              </div>
              <h1 className="text-4xl font-bold text-pink-600">
                Borracha de Roupas
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Compre Tokens
            </h2>
            
            
            <div className="space-y-4">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-white border-2 rounded-lg p-6 flex items-center justify-between ${
                    pkg.popular 
                      ? 'border-pink-300 shadow-lg' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 -left-2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mais popular
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg font-bold">T</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {pkg.tokens} tokens
                      </div>
                      <div className="text-lg text-gray-600">
                        R$ {pkg.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(pkg)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Comprar agora
                  </button>
                </div>
              ))}
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 p-4 bg-pink-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Como funciona?
              </h3>
              <ul className="text-gray-600 space-y-1">
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
