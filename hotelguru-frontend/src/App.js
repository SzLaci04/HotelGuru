import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import RoomList from './components/RoomList';
import BookRoom from './components/BookRoom';
import BookingList from './components/BookingList';
import ReceptionistTasks from './components/ReceptionistTasks';
import InvoiceViewer from './components/InvoiceViewer'; 
import InvoiceList from './components/InvoiceList'; 
import AdminInvoices from './components/AdminInvoices';
import 'bootstrap/dist/css/bootstrap.min.css';

// Védett útvonal komponens
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Recepciós és Admin védett útvonal javított verziója
const StaffRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Elfogadható szerepkörök listája
  const allowedRoles = ['admin', 'recepciós', 'recepcios', 'Recepciós', 'Admin', 'recepciÃ³s'];
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route 
            path="/book-room/:roomId" 
            element={
              <ProtectedRoute>
                <BookRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/receptionist-tasks" 
            element={
              <StaffRoute>
                <ReceptionistTasks />
              </StaffRoute>
            } 
          />
          <Route 
            path="/invoice/:invoiceId" 
            element={
              <ProtectedRoute>
                <InvoiceViewer />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/invoices" 
            element={
              <ProtectedRoute>
                <InvoiceList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/invoices" 
            element={
              <StaffRoute>
                <AdminInvoices />
              </StaffRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;