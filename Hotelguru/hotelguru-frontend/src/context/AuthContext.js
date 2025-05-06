import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Felhasználói állapot inicializálása a localStorage-ból
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);
  
  const login = async (email, jelszo) => {
    try {
      const response = await authService.login(email, jelszo);
      setCurrentUser({
        id: response.id,
        email: response.email,
        nev: response.nev,
        szerep: response.szerep
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (userData) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    isAdmin: currentUser?.szerep === 'admin',
    isReceptionist: currentUser?.szerep === 'recepciós',
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};