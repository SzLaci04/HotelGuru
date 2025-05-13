import React, { createContext, useState, useEffect, useContext } from 'react';
// Nem használjuk az API-t közvetlenül, helyette fetch-et használunk
// import { loginUser } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Token és felhasználói adatok betöltése a localStorage-ból
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://localhost:5079/api/Felhasznalo/bejelentkez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, jelszo: password })
      });
      
      if (!response.ok) {
        console.error('Bejelentkezési hiba:', response.status);
        return false;
      }
      
      const token = await response.text();
      localStorage.setItem('token', token);
      
      // Egyszerű felhasználói adatok mentése
      const userInfo = { email };
      localStorage.setItem('user', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      return true;
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};