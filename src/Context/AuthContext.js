import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const Auth = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (location.state?.fromRegister) {
    return <Navigate to="/" replace />;
  }

  if (token) {
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default Auth;