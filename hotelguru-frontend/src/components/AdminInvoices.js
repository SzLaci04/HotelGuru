// src/components/AdminInvoices.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // JWT token kinyerése
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve!");
      }
      
      // Jogosultság ellenőrzése - módosítva, hogy a recepciósok is hozzáférjenek
      const userRole = localStorage.getItem('userRole');
      // Elfogadható szerepkörök listája
      const allowedRoles = ['admin', 'recepciós', 'recepcios', 'recepciÃ³s'];
      if (!allowedRoles.includes(userRole)) {
        throw new Error("Nincs megfelelő jogosultsága ennek az oldalnak a megtekintéséhez!");
      }
      
      // Párhuzamos lekérések az összes számla és felhasználó adataihoz
      const [invoicesResponse, usersResponse] = await Promise.all([
        fetch('https://localhost:5079/api/Recepcios/szamlak', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('https://localhost:5079/api/Felhasznalo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      
      if (!invoicesResponse.ok) {
        throw new Error(`HTTP hiba a számlák lekérésekor: ${invoicesResponse.status}`);
      }
      
      const invoicesData = await invoicesResponse.json();
      console.log("Összes számla:", invoicesData);
      setInvoices(invoicesData || []);
      
      // Felhasználók betöltése, ha sikeres volt a lekérés
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log("Felhasználók:", usersData);
        setUsers(usersData || []);
      }
    } catch (err) {
      console.error('Hiba történt:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Segédfüggvény a felhasználó nevének megjelenítéséhez
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.nev : `#${userId}`;
  };

  // Segédfüggvény a dátum formázásához
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Segédfüggvény a pénzösszeg formázásához
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Adatok betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Vissza a főoldalra
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Összes számla</h2>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Frissítés
        </button>
      </div>
      
      {invoices.length === 0 ? (
        <div className="alert alert-info">
          Nincsenek számlák a rendszerben.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Számla ID</th>
                <th>Foglalás ID</th>
                <th>Kiállítás dátuma</th>
                <th>Végösszeg</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>#{invoice.id}</td>
                  <td>#{invoice.foglalasId}</td>
                  <td>{formatDate(invoice.kiallitasDatum)}</td>
                  <td>{formatCurrency(invoice.vegsoAr)}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/invoice/${invoice.id}`)}
                    >
                      Megtekintés
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;