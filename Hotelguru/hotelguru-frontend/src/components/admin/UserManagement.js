// src/components/admin/UserManagement.js
// Felhasználókezelés admin komponens

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';

const UserManagement = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/forbidden');
      return;
    }
    
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        setError('Hiba történt a felhasználók betöltése közben.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAdmin, navigate]);
  
  const deleteUser = async (id) => {
    if (!window.confirm('Biztosan törölni szeretné ezt a felhasználót?')) {
      return;
    }
    
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setSuccessMessage('Felhasználó sikeresen törölve!');
      
      // Az üzenet 3 másodperc után eltűnik
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError('Hiba történt a felhasználó törlése közben.');
      console.error(error);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Felhasználók kezelése</h2>
        <Link to="/admin/users/new" className="btn btn-primary">
          <i className="fas fa-user-plus me-2"></i>Új felhasználó
        </Link>
      </div>
      
      {successMessage && (
        <div className="alert alert-success mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Név</th>
                  <th>Email</th>
                  <th>Szerepkör</th>
                  <th>Lakcím</th>
                  <th>Telefonszám</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nev}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${
                        user.szerep === 'admin' ? 'bg-danger' :
                        user.szerep === 'recepciós' ? 'bg-warning' :
                        'bg-info'
                      }`}>
                        {user.szerep}
                      </span>
                    </td>
                    <td>{user.lakcim}</td>
                    <td>{user.telefonszam}</td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Nincsenek felhasználók az adatbázisban.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;