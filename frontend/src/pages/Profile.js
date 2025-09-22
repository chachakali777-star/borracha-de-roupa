import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingTokensModal from '../components/LoadingTokensModal';
import { trackViewContent, trackInitiateCheckout, trackAddToCart } from '../utils/metaPixel';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVipModal, setShowVipModal] = useState(false);
  const [showLoadingTokensModal, setShowLoadingTokensModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  useEffect(() => {
    // Rastrear visualização da página de perfil
    trackViewContent('profile_page', 'page');
    
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        endereco: user.endereco || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data.user);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await api.get('/users/me');
      updateUser(response.data.user);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const handleVipPayment = () => {
    console.log('🚀 Redirecionando para Nitro Pagamentos...');
    
    // Rastrear início de checkout no Meta Pixel
    trackInitiateCheckout(49.90, 'BRL', ['vip_upgrade']);
    
    // Rastrear adição ao carrinho no Meta Pixel
    trackAddToCart(49.90, 'BRL', 'vip_upgrade');
    
    // Redirecionar diretamente para o link do Nitro Pagamentos
    window.open('https://go.nitropagamentos.com/uwivxoxyie_ct54df4qkt', '_blank');
    
    // Fechar o modal
    setShowVipModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          {/* VIP Badge */}
          <div
            className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center cursor-pointer"
            onClick={() => setShowVipModal(true)}
          >
            👑 VIP
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-pink-500">
            Meu Perfil
          </h1>
          
          {/* Tokens Display */}
          <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
            💎 {user?.tokens || 0}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {user?.nome || 'Usuário'}
            </h2>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>
          
          {/* Token Info */}
          <div className="bg-pink-50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">
                {user?.tokens || 0}
              </div>
              <p className="text-gray-600 text-sm">Tokens disponíveis</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowLoadingTokensModal(true)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              💰 Carregar Tokens
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              ✨ Experimentar Roupas
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-20">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
            📝 Informações Pessoais
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-gray-700 text-sm font-medium mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duração-200"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="telefone" className="block text-gray-700 text-sm font-medium mb-2">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <label htmlFor="endereco" className="block text-gray-700 text-sm font-medium mb-2">
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Sua cidade, estado"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={refreshUserData}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                🔄 Atualizar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : '💾 Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-center space-x-8">
            {/* Ver Conta */}
            <button
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center space-y-1 text-pink-500"
            >
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <svg fill="white" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Ver Conta</span>
            </button>

            {/* Início */}
            <button
              onClick={() => navigate('/')}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-pink-500 transition-colors duration-200"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs font-medium">Início</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIP Modal (igual ao da Dashboard) */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👑</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Upgrade para VIP
              </h2>
              <p className="text-gray-600">Desbloqueie todos os recursos premium</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-gray-700">Acesso a todos os recursos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-gray-700">Processamento ilimitado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-gray-700">Suporte prioritário</span>
              </div>
            </div>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-pink-600 mb-1">R$ 49,90</div>
              <div className="text-gray-500 text-sm">Pagamento único</div>
            </div>
            <div className="space-y-3">
              <button onClick={handleVipPayment} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">💰 Comprar VIP Agora</button>
              <button onClick={() => setShowVipModal(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Carregamento de Tokens */}
      <LoadingTokensModal
        isOpen={showLoadingTokensModal}
        onClose={() => setShowLoadingTokensModal(false)}
      />
    </div>
  );
};

export default Profile;
