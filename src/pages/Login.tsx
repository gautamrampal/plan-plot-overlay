import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@/components/LoginScreen';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return <LoginScreen onLogin={handleLogin} />;
};

export default Login;