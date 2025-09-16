import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  useEffect(() => {
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
      
      <div className="relative z-10 max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              👤 Meu Perfil
            </h1>
            <p className="text-xl text-gray-300">
              Gerencie suas informações pessoais e configurações
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-3xl">
                      {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {user?.nome || 'Usuário'}
                  </h2>
                  <p className="text-gray-400 mb-4">{user?.email}</p>
                  
                  {/* Token Display */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        {user?.tokens || 0}
                      </div>
                      <p className="text-gray-300 text-sm">Tokens disponíveis</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <a
                      href="/tokens"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 block text-center"
                    >
                      💎 Carregar Tokens
                    </a>
                    <a
                      href="/upload"
                      className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 block text-center"
                    >
                      ✨ Experimentar Roupas
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                  📝 Informações Pessoais
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-300 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Sua cidade, estado"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">✅</span>
                        <span className="font-medium">{success}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={refreshUserData}
                      className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50"
                    >
                      🔄 Atualizar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        '💾 Salvar Alterações'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
