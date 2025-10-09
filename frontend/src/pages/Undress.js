import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import AccessModal from '../components/AccessModal';
import InsufficientTokensModal from '../components/InsufficientTokensModal';
import { trackUploadImage, trackViewContent } from '../utils/metaPixel';

const Undress = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showInsufficientTokensModal, setShowInsufficientTokensModal] = useState(false);

  // Debug: mostrar estado atual
  console.log('🔍 Undress: loading =', authLoading, 'user =', user);

  useEffect(() => {
    // Rastrear visualização da página de despir
    trackViewContent('undress_page', 'page');
  }, []);

  // Mostrar loading se ainda estiver carregando
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setError('');
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar se o usuário está logado
    if (!user) {
      setShowAccessModal(true);
      return;
    }
    
    if (!imageFile) {
      setError('Selecione uma imagem para processar');
      return;
    }

    if (user.tokens < 25) {
      setShowInsufficientTokensModal(true);
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Rastrear upload de imagem no Meta Pixel
      trackUploadImage();
      
      // Usar endpoint mock para despir
      const response = await api.post('/upload/undress-mock', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      
      // Rastrear visualização de resultado
      trackViewContent('undress_result', 'generated_content');
      
      // Atualizar tokens do usuário
      updateUser({ tokens: response.data.tokensRemaining });
      
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao processar imagem');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pt-20">
        {/* Warning Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold text-sm">Conteúdo Adulto</h3>
              <p className="text-red-700 text-xs">
                Esta funcionalidade é apenas para maiores de 18 anos
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 text-center border border-pink-200">
          <div className="text-pink-600 text-lg font-semibold mb-2">
            🎭 Remover Roupas com IA
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Faça upload de uma imagem para remover roupas automaticamente
          </p>
          
          {/* Aviso para usuários não logados */}
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <p className="text-yellow-800 text-sm font-medium">
                  Você precisa fazer login para usar esta funcionalidade
                </p>
              </div>
              <p className="text-yellow-700 text-xs mt-1">
                Faça seu cadastro e compre tokens para começar!
              </p>
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
                  onClick={() => navigate('/tokens')}
                  className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                >
                  + Comprar
                </button>
                {!user?.isVip && (
                  <button
                    onClick={() => window.open('https://go.nitropagamentos.com/3pbth', '_blank')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md"
                  >
                    👑 VIP
                  </button>
                )}
            </div>
          </div>
        </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-20 border border-pink-200">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload da imagem */}
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">📸 Sua Imagem</h3>
                  <p className="text-gray-600 text-sm">Faça upload de uma imagem clara</p>
                </div>
                <div className="border-2 border-dashed border-pink-300 rounded-2xl p-6 text-center hover:border-pink-400 transition-all duration-300 bg-pink-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview da imagem"
                          className="w-48 h-48 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-sm font-medium">Trocar imagem</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-pink-100 rounded-xl flex items-center justify-center border-2 border-pink-200">
                        <div className="text-center">
                          <span className="text-6xl mb-2 block text-pink-400">📸</span>
                          <span className="text-pink-600 text-sm">Clique para selecionar</span>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <span className="text-gray-800 text-sm font-medium block">
                        {imageFile ? imageFile.name : 'Nenhuma imagem selecionada'}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">
                        JPG, PNG, GIF (máx. 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !imageFile}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processando com IA...</span>
                  </div>
                ) : (
                  '🎭 Processar Imagem ✨'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                  ✅ {result.message}
                </div>
              </div>

              {/* Result Image */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  ✨ Resultado Final
                </h3>
                <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
                  <img
                    src={`http://localhost:5000${result.processedImageUrl}`}
                    alt="Resultado do processamento"
                    className="w-full h-auto rounded-xl shadow-lg mb-4"
                  />
                  
                  {/* Download Button */}
                  <button
                    onClick={async () => {
                      setDownloadLoading(true);
                      try {
                        const imageUrl = `http://localhost:5000${result.processedImageUrl}`;
                        const response = await fetch(imageUrl);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `resultado-despir-${Date.now()}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Erro ao baixar imagem:', error);
                        // Fallback: abrir em nova aba
                        window.open(`http://localhost:5000${result.processedImageUrl}`, '_blank');
                      } finally {
                        setDownloadLoading(false);
                      }
                    }}
                    disabled={downloadLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Baixando...</span>
                      </div>
                    ) : (
                      '📥 Baixar Imagem'
                    )}
                  </button>
                  
                  <p className="text-center text-gray-600 text-sm">
                    Sua imagem processada com IA! 🎉
                  </p>
                  {result.note && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-700 text-xs text-center">
                        ℹ️ {result.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={resetForm}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  🔄 Processar Outra Imagem
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  🏠 Voltar ao Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Acesso */}
      <AccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        title="Acesso Necessário"
        message="Você precisa fazer login para usar esta funcionalidade premium"
        redirectTo="/undress"
      />

      {/* Modal de Tokens Insuficientes */}
      <InsufficientTokensModal
        isOpen={showInsufficientTokensModal}
        onClose={() => setShowInsufficientTokensModal(false)}
        requiredTokens={25}
        currentTokens={user?.tokens || 0}
      />
    </div>
  );
};

export default Undress;

