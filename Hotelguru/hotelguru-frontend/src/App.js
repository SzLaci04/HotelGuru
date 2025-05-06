// src/App.js
// Az alkalmazás fő komponense

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Hotel components
import RoomList from './components/hotel/RoomList';
import RoomDetails from './components/hotel/RoomDetails';

// User components
import UserProfile from './components/user/UserProfile';
import Reservations from './components/user/Reservations';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';

// Home page component
const Home = () => (
  <div className="container py-5">
    <div className="jumbotron">
      <h1 className="display-4">Üdvözöljük a HotelGuru rendszerben!</h1>
      <p className="lead">
        A HotelGuru a legegyszerűbb módja a szállásfoglalásnak.
        Böngésszen szobáink között és foglaljon kényelmesen, néhány kattintással.
      </p>
      <hr className="my-4" />
      <p>
        Már regisztrált felhasználó? Jelentkezzen be és kezelje foglalásait.
        Új felhasználó? Regisztráljon most!
      </p>
      <div className="d-flex gap-2">
        <a className="btn btn-primary btn-lg" href="/login" role="button">
          Bejelentkezés
        </a>
        <a className="btn btn-outline-primary btn-lg" href="/register" role="button">
          Regisztráció
        </a>
      </div>
    </div>
    
    <div className="row mt-5">
      <div className="col-md-4 mb-4">
        <div className="card shadow h-100">
          <div className="card-body text-center">
            <i className="fas fa-search fa-3x mb-3 text-primary"></i>
            <h3>Keresés</h3>
            <p>Böngésszen szobáink között és találja meg az igényeinek megfelelő szállást.</p>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 mb-4">
        <div className="card shadow h-100">
          <div className="card-body text-center">
            <i className="fas fa-calendar-check fa-3x mb-3 text-success"></i>
            <h3>Foglalás</h3>
            <p>Foglalja le szobáját online, kényelmesen, bármikor, bárhonnan.</p>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 mb-4">
        <div className="card shadow h-100">
          <div className="card-body text-center">
            <i className="fas fa-bed fa-3x mb-3 text-info"></i>
            <h3>Szállás</h3>
            <p>Élvezze a kényelmes szállást és a minőségi szolgáltatásokat.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 404 page
const NotFound = () => (
  <div className="container py-5 text-center">
    <h1 className="display-1">404</h1>
    <p className="lead">Az oldal nem található.</p>
    <a href="/" className="btn btn-primary">Vissza a főoldalra</a>
  </div>
);

// Forbidden page
const Forbidden = () => (
  <div className="container py-5 text-center">
    <h1 className="display-1">403</h1>
    <p className="lead">Nincs jogosultsága az oldal megtekintéséhez.</p>
    <a href="/" className="btn btn-primary">Vissza a főoldalra</a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          
          <main className="flex-grow-1">
            <Routes>
              {/* Nyilvános útvonalak */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              
              {/* Védett útvonalak - csak bejelentkezett felhasználók számára */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/reservations" element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              } />
              
              {/* Admin és recepciós útvonalak */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin', 'recepciós']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              
              {/* Egyéb útvonalak */}
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;