
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // Fix: The AuthContext provides a 'user' object, not 'isAuthenticated'.
  // Authentication is determined by the presence of the 'user' object.
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;