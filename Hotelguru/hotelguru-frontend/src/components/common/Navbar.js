import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, isAdmin, isReceptionist, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
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
            
            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/reservations">Foglalásaim</Link>
              </li>
            )}
            
            {(isAdmin || isReceptionist) && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">Admin felület</Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="fas fa-user me-1"></i>
                    {currentUser.nev}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    Kijelentkezés
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Bejelentkezés</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Regisztráció</Link>
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