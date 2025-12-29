import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import React from 'react';
import { UserContext } from '../../context/userContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(UserContext);

  if (!context) return null;

  const { user } = context;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
