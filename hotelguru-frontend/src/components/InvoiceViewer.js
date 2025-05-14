// src/components/InvoiceViewer.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const InvoiceViewer = () => {
  const { invoiceId } = useParams();
  const { isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        
        // JWT token kinyerése
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
        }
        
        // Számla lekérése
        const invoiceResponse = await fetch(`https://localhost:5079/api/Felhasznalo/sajatSzamlak`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!invoiceResponse.ok) {
          const errorText = await invoiceResponse.text();
          throw new Error(`HTTP hiba a számlák lekérésekor: ${invoiceResponse.status} - ${errorText}`);
        }
        
        const invoicesData = await invoiceResponse.json();
        console.log("Összes számla:", invoicesData);
        
        // Keressük meg a kívánt számlát az ID alapján
        const selectedInvoice = invoicesData.find(inv => inv.id === parseInt(invoiceId));
        if (!selectedInvoice) {
          throw new Error(`Nem található a ${invoiceId} azonosítójú számla.`);
        }
        
        console.log("Kiválasztott számla:", selectedInvoice);
        setInvoice(selectedInvoice);
        
        // Ha sikerült lekérni a számlát, lekérjük a foglalást is
        if (selectedInvoice && selectedInvoice.foglalasId) {
          const bookingResponse = await fetch(`https://localhost:5079/api/Foglalas/${selectedInvoice.foglalasId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (bookingResponse.ok) {
            const bookingData = await bookingResponse.json();
            console.log("Foglalás adatai:", bookingData);
            setBooking(bookingData);
          } else {
            console.warn("Nem sikerült lekérni a foglalás adatait");
          }
        }
      } catch (err) {
        console.error('Számla betöltési hiba:', err);
        setError('Nem sikerült betölteni a számlát: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceData();
  }, [invoiceId, navigate, isAuthenticated]);

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
        <p className="mt-3">Számla betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Vissza</button>
      </div>
    );
  }

  if (!invoice || !booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">A számla vagy a foglalás nem található.</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Vissza</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Számla #{invoice.id}</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="mb-3">Szálloda adatok</h5>
              <p className="mb-1"><strong>Név:</strong> HotelGuru</p>
              <p className="mb-1"><strong>Cím:</strong> 1234 Budapest, Példa utca 1.</p>
              <p className="mb-1"><strong>Adószám:</strong> 12345678-2-42</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h5 className="mb-3">Számla adatok</h5>
              <p className="mb-1"><strong>Számla azonosító:</strong> #{invoice.id}</p>
              <p className="mb-1"><strong>Kiállítás dátuma:</strong> {formatDate(invoice.kiallitasDatum)}</p>
              <p className="mb-1"><strong>Foglalás azonosító:</strong> #{invoice.foglalasId}</p>
            </div>
          </div>
          
          <hr className="my-4" />
          
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="mb-3">Vendég foglalási szándékai</h5>
              <p className="mb-1"><strong>Érkezés:</strong> {formatDate(booking.erkezes)}</p>
              <p className="mb-1"><strong>Távozás:</strong> {formatDate(booking.tavozas)}</p>
              <p className="mb-1"><strong>Személyek száma:</strong> {booking.foSzam} fő</p>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Szállás adatok</h5>
              <p className="mb-1"><strong>Szoba:</strong> {booking.foglaltSzobaId}. szoba</p>
              <p className="mb-1"><strong>Éjszakák száma:</strong> {Math.ceil((new Date(booking.tavozas) - new Date(booking.erkezes)) / (1000 * 60 * 60 * 24))} éj</p>
              <p className="mb-1"><strong>Plusz szolgáltatás:</strong> {booking.pluszSzolgId}. számú szolgáltatás</p>
            </div>
          </div>
          
          <hr className="my-4" />
          
          <div className="row">
            <div className="col-12">
              <h5>Számlázott tételek</h5>
              <table className="table table-bordered mt-3">
                <thead className="table-light">
                  <tr>
                    <th>Tétel</th>
                    <th className="text-end">Összeg</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Szállás díj</td>
                    <td className="text-end">{formatCurrency(invoice.vegsoAr * 0.9)}</td>
                  </tr>
                  <tr>
                    <td>Plusz szolgáltatás</td>
                    <td className="text-end">{formatCurrency(invoice.vegsoAr * 0.1)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <th>Összesen:</th>
                    <th className="text-end">{formatCurrency(invoice.vegsoAr)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col-md-6">
              <p className="small text-muted">
                Ez a számla elektronikusan került kiállításra és érvényes aláírás nélkül is.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <button className="btn btn-outline-primary me-2" onClick={() => window.print()}>
                <i className="bi bi-printer"></i> Nyomtatás
              </button>
              <button className="btn btn-primary" onClick={() => navigate(-1)}>
                Vissza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;