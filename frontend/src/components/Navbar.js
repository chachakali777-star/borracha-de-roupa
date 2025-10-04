import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-zinc-900/95 backdrop-blur-md border-b border-rose-500/30 shadow-2xl fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 p-1">
                <img src="/img/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
                  Borracha de Roupa
                </h1>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Main Navigation Buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/upload"
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-500/25"
                  >
                    ✨ Experimentar
                  </Link>
                  <Link
                    to="/tokens"
                    className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                  >
                    💎 Tokens
                  </Link>
                  {!user.isVip && (
                    <Link
                      to="/?vip=true"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                    >
                      👑 VIP
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                    >
                      ⚙️ Admin
                    </Link>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-3 bg-black/20 hover:bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2 transition-all duration-300 hover:border-purple-500/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.nome?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">
                        {user.nome}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400">Online</span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-purple-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user.nome?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.nome}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                        <div className="mt-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {user.tokens}
                            </div>
                            <div className="text-gray-300 text-sm">Tokens disponíveis</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="text-lg">👤</span>
                          <span>Meu Perfil</span>
                        </Link>
                        <Link
                          to="/upload"
                          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="text-lg">✨</span>
                          <span>Experimentar Roupas</span>
                        </Link>
                        <Link
                          to="/tokens"
                          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="text-lg">💎</span>
                          <span>Carregar Tokens</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="text-lg">⚙️</span>
                            <span>Painel Admin</span>
                          </Link>
                        )}
                        <div className="border-t border-purple-500/20 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                        >
                          <span className="text-lg">🚪</span>
                          <span>Sair da Conta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Navigation for non-logged users */
              <div className="flex items-center space-x-4">
                {/* Main Navigation Buttons for non-logged users */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/upload"
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-500/25"
                  >
                    ✨ Experimentar
                  </Link>
                  <Link
                    to="/tokens"
                    className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                  >
                    💎 Tokens
                  </Link>
                  <Link
                    to="/?vip=true"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                  >
                    👑 VIP
                  </Link>
                </div>
                
                {/* Login/Register Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-rose-500/25"
                  >
                    Cadastrar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
