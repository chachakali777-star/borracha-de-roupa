import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Upload = () => {
  const { user, updateUser } = useAuth();
  const [personFile, setPersonFile] = useState(null);
  const [clothingFile, setClothingFile] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [clothingPreview, setClothingPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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
    
    if (!personFile) {
      setError('Selecione uma foto da pessoa');
      return;
    }

    if (!clothingFile) {
      setError('Selecione uma foto da roupa');
      return;
    }

    if (user.tokens < 25) {
      setError(`Tokens insuficientes. Necessário: 25 tokens. Disponível: ${user.tokens} tokens`);
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('personImage', personFile);
    formData.append('clothingImage', clothingFile);

    try {
      // Usar endpoint para 2 imagens da Fashn.ai
      const response = await api.post('/upload/process-two-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      
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
      
      <div className="relative z-10 max-w-6xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              🎭 Experimente Roupas Virtualmente
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Faça upload de sua foto e de uma roupa para ver como você ficaria usando-a!
            </p>
            
            {/* Token Info */}
            <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💎</span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user?.tokens || 0}</p>
                  <p className="text-gray-400 text-sm">Tokens disponíveis</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3">
                Cada experimento consome 25 tokens
              </p>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-2xl">

            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Upload da pessoa */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">👤 Sua Foto</h3>
                      <p className="text-gray-400">Faça upload de uma foto sua clara</p>
                    </div>
                    <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 bg-black/20">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePersonFileSelect}
                        className="hidden"
                        id="person-upload"
                      />
                      <label
                        htmlFor="person-upload"
                        className="cursor-pointer flex flex-col items-center space-y-4"
                      >
                        {personPreview ? (
                          <div className="relative">
                            <img
                              src={personPreview}
                              alt="Preview da pessoa"
                              className="w-48 h-48 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white text-sm font-medium">Trocar foto</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border-2 border-purple-500/30">
                            <div className="text-center">
                              <span className="text-6xl mb-2 block">👤</span>
                              <span className="text-purple-300 text-sm">Clique para selecionar</span>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <span className="text-white font-medium">
                            {personFile ? personFile.name : 'Nenhuma foto selecionada'}
                          </span>
                          <p className="text-gray-400 text-sm mt-1">
                            Formatos: JPG, PNG, GIF (máx. 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Upload da roupa */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">👕 Roupa</h3>
                      <p className="text-gray-400">Faça upload da roupa que deseja experimentar</p>
                    </div>
                    <div className="border-2 border-dashed border-pink-500/30 rounded-2xl p-8 text-center hover:border-pink-500/50 transition-all duration-300 bg-black/20">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleClothingFileSelect}
                        className="hidden"
                        id="clothing-upload"
                      />
                      <label
                        htmlFor="clothing-upload"
                        className="cursor-pointer flex flex-col items-center space-y-4"
                      >
                        {clothingPreview ? (
                          <div className="relative">
                            <img
                              src={clothingPreview}
                              alt="Preview da roupa"
                              className="w-48 h-48 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white text-sm font-medium">Trocar roupa</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-48 h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border-2 border-pink-500/30">
                            <div className="text-center">
                              <span className="text-6xl mb-2 block">👕</span>
                              <span className="text-pink-300 text-sm">Clique para selecionar</span>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <span className="text-white font-medium">
                            {clothingFile ? clothingFile.name : 'Nenhuma roupa selecionada'}
                          </span>
                          <p className="text-gray-400 text-sm mt-1">
                            Formatos: JPG, PNG, GIF (máx. 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">⚠️</span>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading || !personFile || !clothingFile}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processando com IA...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Experimentar Agora</span>
                        <span>✨</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            ) : (
            <div className="space-y-8">
              {/* Success Message */}
              <div className="text-center">
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl backdrop-blur-sm inline-block">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">✅</span>
                    <span className="font-medium">{result.message}</span>
                  </div>
                </div>
              </div>

              {/* Result Image */}
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  ✨ Resultado Final
                </h3>
                <div className="max-w-2xl mx-auto">
                  <div className="bg-black/30 border border-green-500/20 rounded-2xl p-6 shadow-2xl">
                    <img
                      src={`https://borracharoupa.fun${result.processedImageUrl}`}
                      alt="Resultado do Virtual Try-On"
                      className="w-full h-auto rounded-xl shadow-2xl"
                    />
                    <p className="text-center text-gray-300 mt-4 text-lg">
                      Sua foto com a roupa experimentada virtualmente! 🎉
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="mr-2">🔄</span>
                  Experimentar Outra Roupa
                </button>
                <a
                  href="/"
                  className="px-8 py-4 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 hover:text-white font-bold text-lg rounded-2xl transition-all duration-300 border border-gray-500/30 hover:border-gray-500/50 text-center"
                >
                  <span className="mr-2">🏠</span>
                  Voltar ao Dashboard
                </a>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
