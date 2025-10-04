import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pt-20">
        {/* Header Card */}
        <div className="bg-zinc-900/90 rounded-2xl shadow-lg p-4 mb-6 text-center border border-rose-500/30">
          <h1 className="text-2xl font-bold text-rose-500">
            Meu Perfil
          </h1>
          
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900/90 rounded-2xl shadow-lg p-6 mb-6 border border-rose-500/30">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {user?.nome || 'Usuário'}
            </h2>
            <p className="text-zinc-400 text-sm">{user?.email}</p>
          </div>
          
          {/* Token Info */}
          <div className="bg-rose-950/30 rounded-xl p-4 mb-6 border border-rose-500/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-400 mb-1">
                💎 {user?.tokens || 0}
              </div>
              <p className="text-zinc-300 text-sm">Tokens disponíveis</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowLoadingTokensModal(true)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              💰 Carregar Tokens
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              ✨ Experimentar Roupas
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-zinc-900/90 rounded-2xl shadow-lg p-6 mb-6 border border-rose-500/30">
          <h3 className="text-lg font-bold text-white mb-6 text-center">
            📝 Informações Pessoais
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-white text-sm font-medium mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="telefone" className="block text-white text-sm font-medium mb-2">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <label htmlFor="endereco" className="block text-white text-sm font-medium mb-2">
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
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
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                🔄 Atualizar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : '💾 Salvar'}
              </button>
            </div>
          </form>
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
