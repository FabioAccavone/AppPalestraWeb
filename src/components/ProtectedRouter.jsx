import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('user'); // Verifica se il token è presente

  if (!token) {
    
    return <Navigate to="/login" />;
  }

  return children; // Mostra il contenuto protetto se autenticato
};

export default ProtectedRoute;
