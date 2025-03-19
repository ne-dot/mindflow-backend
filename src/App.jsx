import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Agents from './pages/Agents';
import Tools from './pages/Tools';
import Models from './pages/Models';
import Prompts from './pages/Prompts';
import './App.css';

// 简单的身份验证检查
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/users" element={
          <PrivateRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/agents" element={
          <PrivateRoute>
            <MainLayout>
              <Agents />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/tools" element={
          <PrivateRoute>
            <MainLayout>
              <Tools />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/models" element={
          <PrivateRoute>
            <MainLayout>
              <Models />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/prompts" element={
          <PrivateRoute>
            <MainLayout>
              <Prompts />
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;