// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // JWT token dekódolása UTF-8 támogatással
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Token dekódolási hiba:', e);
      return null;
    }
  };

  useEffect(() => {
    // Token és felhasználói adatok betöltése a localStorage-ból
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        
        // Felhasználói szerepkör beállítása a tokenből
        const decoded = decodeJWT(token);
        if (decoded) {
          const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          setUserRole(role);
          // Tároljuk el localStorage-ben is a szerepkört
          localStorage.setItem('userRole', role);
        }
      } catch (e) {
        console.error('Felhasználói adatok betöltési hiba:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        setCurrentUser(null);
        setUserRole(null);
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Bejelentkezés kezdeményezése:", email);
      
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
      console.log('Token megkapta:', token.substring(0, 20) + '...');
      localStorage.setItem('token', token);
      
      // Szerepkör kinyerése a tokenből
      const decoded = decodeJWT(token);
      if (decoded) {
        // A userId is kinyerhető a tokenből
        const userId = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'];
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log('Felhasználói szerepkör:', role);
        setUserRole(role);
        localStorage.setItem('userRole', role);
        
        // Egyszerű felhasználói adatok mentése
        const userInfo = { email, role, userId };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setCurrentUser(userInfo);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Bejelentkezési hiba részletek:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
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