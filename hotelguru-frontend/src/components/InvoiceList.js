import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        
        // JWT token kinyerése
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
        }
        
        // Számlák lekérése
        const response = await fetch('https://localhost:5079/api/Felhasznalo/sajatSzamlak', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP hiba a számlák lekérésekor: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Számlák adatai:", data);
        setInvoices(data);
      } catch (err) {
        console.error('Számlák betöltési hiba:', err);
        setError('Nem sikerült betölteni a számlákat: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Segédfüggvény a dátum formázásához
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pénzösszeg formázása
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
        <p className="mt-3">Számlák betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Számlák listája</h2>
      
      {invoices.length === 0 ? (
        <div className="alert alert-info mt-3">
          Nincsenek számlák.
        </div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Számla azonosító</th>
                <th>Foglalás azonosító</th>
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

export default InvoiceList;