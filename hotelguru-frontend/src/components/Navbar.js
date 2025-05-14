import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

 
  useEffect(() => {
    
    console.log('URL változott:', location.pathname);
  }, [location.pathname]);

 
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

  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  const isReceptionistOrAdmin = 
    userRole === 'recepciós' || 
    userRole === 'recepció' || 
    userRole === 'Recepciós' || 
    userRole === 'Recepció' || 
    userRole === 'recepcio' ||
    userRole === 'Recepcio' ||
    userRole === 'Recepcios' ||
    userRole === 'recepciÃ³s'||
    userRole === 'recepcios' ||
    userRole === 'admin' || 
    userRole === 'Admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">HotelGuru</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Főoldal</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/rooms">Szobák</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings">Foglalásaim</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/invoices">Számláim</Link>
                </li>
                
                {/* Recepciós feladatok fül - csak recepciós és admin felhasználóknak */}
                {isReceptionistOrAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/receptionist-tasks">
                      Recepciós feladatok
                    </Link>
                  </li>
                )}
                {/* Összes számla menüpont - most már recepciósoknak is elérhető */}
                {isReceptionistOrAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/invoices">
                      Összes számla
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Bejelentkezés</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Regisztráció</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    {userRole ? `Bejelentkezve mint: ${userRole}` : 'Bejelentkezve'}
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-link nav-link" 
                    onClick={handleLogout}
                  >
                    Kijelentkezés
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;