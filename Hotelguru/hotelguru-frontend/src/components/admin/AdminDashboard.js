import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const { currentUser, isAdmin, isReceptionist } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    reservations: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Ha nem admin vagy recepciós, átirányítás
    if (!isAdmin && !isReceptionist) {
      navigate('/forbidden');
      return;
    }
    
    const fetchStats = async () => {
      // Valós implementációban API hívások lennének
      // Dummy adatok most
      setStats({
        users: 25,
        rooms: 15,
        reservations: 42,
        revenue: 1250000
      });
      
      setLoading(false);
    };
    
    fetchStats();
  }, [isAdmin, isReceptionist, navigate]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="container py-5">
      <h2 className="mb-4">Admin irányítópult</h2>
      
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Felhasználók</h5>
                  <h2 className="mb-0">{stats.users}</h2>
                </div>
                <i className="fas fa-users fa-3x opacity-50"></i>
              </div>
              <Link to="/admin/users" className="text-white small stretched-link">Részletek</Link>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Szobák</h5>
                  <h2 className="mb-0">{stats.rooms}</h2>
                </div>
                <i className="fas fa-door-open fa-3x opacity-50"></i>
              </div>
              <Link to="/admin/rooms" className="text-white small stretched-link">Részletek</Link>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Foglalások</h5>
                  <h2 className="mb-0">{stats.reservations}</h2>
                </div>
                <i className="fas fa-calendar-check fa-3x opacity-50"></i>
              </div>
              <Link to="/admin/reservations" className="text-white small stretched-link">Részletek</Link>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card bg-warning text-white shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Bevétel</h5>
                  <h2 className="mb-0">{stats.revenue.toLocaleString('hu-HU')} Ft</h2>
                </div>
                <i className="fas fa-money-bill-wave fa-3x opacity-50"></i>
              </div>
              <Link to="/admin/revenue" className="text-white small stretched-link">Részletek</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-xl-8 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Legújabb foglalások</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Foglalás ID</th>
                      <th>Vendég</th>
                      <th>Szoba</th>
                      <th>Érkezés</th>
                      <th>Távozás</th>
                      <th>Állapot</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>125</td>
                      <td>Kovács János</td>
                      <td>Superior szoba</td>
                      <td>2025.05.15</td>
                      <td>2025.05.18</td>
                      <td><span className="badge bg-success">Aktív</span></td>
                    </tr>
                    <tr>
                      <td>124</td>
                      <td>Nagy Katalin</td>
                      <td>Deluxe szoba</td>
                      <td>2025.05.12</td>
                      <td>2025.05.14</td>
                      <td><span className="badge bg-info">Bejelentkezett</span></td>
                    </tr>
                    <tr>
                      <td>123</td>
                      <td>Szabó Péter</td>
                      <td>Standard szoba</td>
                      <td>2025.05.10</td>
                      <td>2025.05.12</td>
                      <td><span className="badge bg-secondary">Befejezett</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link to="/admin/reservations" className="btn btn-sm btn-primary">Összes foglalás</Link>
            </div>
          </div>
        </div>
        
        <div className="col-xl-4 mb-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">Gyors műveletek</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/admin/rooms/new" className="btn btn-outline-primary">
                  <i className="fas fa-plus-circle me-2"></i>Új szoba hozzáadása
                </Link>
                <Link to="/admin/users/new" className="btn btn-outline-primary">
                  <i className="fas fa-user-plus me-2"></i>Új felhasználó létrehozása
                </Link>
                <Link to="/admin/reservations/new" className="btn btn-outline-primary">
                  <i className="fas fa-calendar-plus me-2"></i>Új foglalás felvétele
                </Link>
                <Link to="/admin/reports" className="btn btn-outline-primary">
                  <i className="fas fa-chart-bar me-2"></i>Riportok megtekintése
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;