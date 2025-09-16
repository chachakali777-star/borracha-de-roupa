import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Admin = () => {
  // const { } = useAuth(); // Removido para evitar warning
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [tokenCount, setTokenCount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleEditTokens = (user) => {
    setEditingUser(user);
    setTokenCount(user.tokens.toString());
    setError('');
    setSuccess('');
  };

  const handleUpdateTokens = async () => {
    if (!editingUser) return;

    try {
      await api.put(`/admin/users/${editingUser.id}/tokens`, {
        tokens: parseInt(tokenCount)
      });

      setSuccess('Tokens atualizados com sucesso');
      setEditingUser(null);
      setTokenCount('');
      fetchUsers();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar tokens');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccess('Usuário excluído com sucesso');
      fetchUsers();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao excluir usuário');
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setTokenCount('');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Painel Administrativo
          </h1>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Estatísticas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total de Usuários
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">T</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total de Tokens
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalTokens}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">A</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Administradores
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.adminUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">M</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Média de Tokens
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.averageTokensPerUser}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de usuários */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Usuários
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Gerencie usuários e seus tokens
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {user.tokens} tokens
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTokens(user)}
                          className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                        >
                          Editar Tokens
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.nome)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Modal de edição */}
          {editingUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Editar Tokens - {editingUser.nome}
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tokens
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tokenCount}
                      onChange={(e) => setTokenCount(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateTokens}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      Atualizar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
