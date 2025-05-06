import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Betöltés...</div>;
  }
  
  // Ha nincs bejelentkezve, irányítás a bejelentkezési oldalra
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Ha vannak meghatározott szerepkörök és a felhasználó nem rendelkezik azokkal
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.szerep)) {
    return <Navigate to="/forbidden" replace />;
  }
  
  return children;
};

export default ProtectedRoute;