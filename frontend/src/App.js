import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Undress from './pages/Undress';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Tokens from './pages/Tokens';
import Profile from './pages/Profile';
import AgeGateModal from './components/AgeGateModal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen h-nsfw">
          <AgeGateModal />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={<Dashboard />}
            />
            <Route 
              path="/upload" 
              element={<Upload />}
            />
            <Route 
              path="/undress" 
              element={<Undress />}
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } 
            />
            <Route 
              path="/tokens" 
              element={<Tokens />}
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
