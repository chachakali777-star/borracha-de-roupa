import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import AccessModal from '../components/AccessModal';
import InsufficientTokensModal from '../components/InsufficientTokensModal';
import { trackUploadImage, trackViewContent, trackInitiateCheckout, trackAddToCart } from '../utils/metaPixel';

const Upload = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [personFile, setPersonFile] = useState(null);
  const [clothingFile, setClothingFile] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [clothingPreview, setClothingPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showVipModal, setShowVipModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showInsufficientTokensModal, setShowInsufficientTokensModal] = useState(false);

  // Debug: mostrar estado atual
  console.log('🔍 Upload: loading =', authLoading, 'user =', user);

  useEffect(() => {
    // Rastrear visualização da página de upload
    trackViewContent('upload_page', 'page');
  }, []);

  // Mostrar loading se ainda estiver carregando
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handlePersonFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonFile(file);
      setError('');
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClothingFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClothingFile(file);
      setError('');
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setClothingPreview(e.target.result);
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
    
    if (!personFile) {
      setError('Selecione uma foto da pessoa');
      return;
    }

    if (!clothingFile) {
      setError('Selecione uma foto da roupa');
      return;
    }

    if (user.tokens < 25) {
      setShowInsufficientTokensModal(true);
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('personImage', personFile);
    formData.append('clothingImage', clothingFile);

    try {
      // Rastrear upload de imagem no Meta Pixel
      trackUploadImage();
      
      // Usar endpoint para 2 imagens da Fashn.ai
      const response = await api.post('/upload/process-two-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      
      // Rastrear visualização de resultado
      trackViewContent('image_result', 'generated_content');
      
      // Atualizar tokens do usuário
      updateUser({ tokens: response.data.tokensRemaining });
      
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao processar imagens');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPersonFile(null);
    setClothingFile(null);
    setPersonPreview(null);
    setClothingPreview(null);
    setResult(null);
    setError('');
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
        {/* Token Info Card */}
        <div className="bg-zinc-900/90 rounded-2xl shadow-lg p-4 mb-6 text-center border border-rose-500/30">
          
          {/* Aviso para usuários não logados */}
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <p className="text-yellow-800 text-sm font-medium">
                  Você precisa fazer login para gerar imagens
                </p>
              </div>
              <p className="text-yellow-700 text-xs mt-1">
                Faça seu cadastro e compre tokens para começar!
              </p>
            </div>
          )}
          
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
                  onClick={() => navigate('/tokens')}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                >
                  + Comprar
                </button>
                {!user?.isVip && (
                  <button
                    onClick={() => window.open('https://go.nitropagamentos.com/3pbth', '_blank')}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md"
                  >
                    👑 VIP
                  </button>
                )}
            </div>
          </div>
        </div>
          </div>

        <div className="bg-zinc-900/90 rounded-2xl shadow-lg p-6 mb-20 border border-rose-500/30">

            {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Upload da pessoa */}
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">👤 Sua Foto</h3>
                  <p className="text-zinc-400 text-sm">Faça upload de uma foto sua clara</p>
                    </div>
                <div className="border-2 border-dashed border-rose-500/50 rounded-2xl p-6 text-center hover:border-rose-500 transition-all duration-300 bg-zinc-800/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePersonFileSelect}
                        className="hidden"
                        id="person-upload"
                      />
                      <label
                        htmlFor="person-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                      >
                        {personPreview ? (
                          <div className="relative">
                            <img
                              src={personPreview}
                              alt="Preview da pessoa"
                          className="w-32 h-32 object-cover rounded-xl shadow-lg"
                            />
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs font-medium">Trocar foto</span>
                            </div>
                          </div>
                        ) : (
                      <div className="w-32 h-32 bg-rose-950/50 rounded-xl flex items-center justify-center border-2 border-rose-500/30">
                            <div className="text-center">
                          <span className="text-4xl mb-1 block text-rose-400">👤</span>
                          <span className="text-rose-400 text-xs">Clique para selecionar</span>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                      <span className="text-white text-sm font-medium block">
                            {personFile ? personFile.name : 'Nenhuma foto selecionada'}
                          </span>
                      <p className="text-zinc-400 text-xs mt-1">
                        JPG, PNG, GIF (máx. 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Upload da roupa */}
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">👕 Roupa</h3>
                  <p className="text-zinc-400 text-sm">Faça upload da roupa que deseja experimentar</p>
                    </div>
                <div className="border-2 border-dashed border-purple-500/50 rounded-2xl p-6 text-center hover:border-purple-500 transition-all duration-300 bg-zinc-800/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleClothingFileSelect}
                        className="hidden"
                        id="clothing-upload"
                      />
                      <label
                        htmlFor="clothing-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                      >
                        {clothingPreview ? (
                          <div className="relative">
                            <img
                              src={clothingPreview}
                              alt="Preview da roupa"
                          className="w-32 h-32 object-cover rounded-xl shadow-lg"
                            />
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs font-medium">Trocar roupa</span>
                            </div>
                          </div>
                        ) : (
                      <div className="w-32 h-32 bg-purple-950/50 rounded-xl flex items-center justify-center border-2 border-purple-500/30">
                            <div className="text-center">
                          <span className="text-4xl mb-1 block text-purple-400">👕</span>
                          <span className="text-purple-400 text-xs">Clique para selecionar</span>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                      <span className="text-white text-sm font-medium block">
                            {clothingFile ? clothingFile.name : 'Nenhuma roupa selecionada'}
                          </span>
                      <p className="text-zinc-400 text-xs mt-1">
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
                      disabled={loading || !personFile || !clothingFile}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processando com IA...</span>
                      </div>
                    ) : (
                  '🚀 Experimentar Agora ✨'
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
                <h3 className="text-lg font-bold text-white mb-4">
                  ✨ Resultado Final
                </h3>
                <div className="bg-zinc-800/50 border border-rose-500/30 rounded-2xl p-4">
                    <img
                      src={`http://localhost:5000${result.processedImageUrl}`}
                      alt="Resultado do Virtual Try-On"
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
                        link.download = `resultado-virtual-tryon-${Date.now()}.jpg`;
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
                  
                  <p className="text-center text-zinc-300 text-sm">
                      Sua foto com a roupa experimentada virtualmente! 🎉
                    </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={resetForm}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  🔄 Experimentar Outra Roupa
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  🏠 Voltar ao Dashboard
                </button>
              </div>
            </div>
            )}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upgrade para VIP</h2>
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

      {/* Modal de Acesso */}
      <AccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        title="Acesso Necessário"
        message="Você precisa fazer login para gerar imagens com IA"
        redirectTo="/upload"
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

export default Upload;
