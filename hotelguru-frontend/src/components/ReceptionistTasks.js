import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ReceptionistTasks = () => {
  console.log("ReceptionistTasks komponens betöltve");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  

  // Meglévő useEffect módosítása:
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Foglalások betöltése
      await fetchBookings();
      
      // Számlák betöltése
      await fetchInvoices();
      
      setError('');
    } catch (err) {
      console.error('Adatok betöltési hiba:', err);
      setError('Hiba történt az adatok betöltésekor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


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

  
  // Ellenőrizzük, hogy a felhasználó recepciós vagy admin-e
  useEffect(() => {
    console.log("Jogosultság ellenőrzés kezdete");
    
    // JWT token kinyerése és ellenőrzése
    const token = localStorage.getItem('token');
    console.log("Token létezik:", !!token);
    
    if (token) {
      try {
        const decoded = decodeJWT(token);
        console.log("Dekódolt token:", decoded);
        
        if (decoded) {
          const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          console.log("Felhasználói szerepkör:", role);
          
          // FONTOS - Ez a sor a kulcs: mindhárom lehetséges értéket ellenőrizzük
          if (role !== 'recepciós' && role !== 'admin' && role !== 'recepcios') {
            console.log("Nincs megfelelő jogosultság, átirányítás a főoldalra");
            alert('Nincs megfelelő jogosultsága ennek az oldalnak a megtekintéséhez!');
            navigate('/');
            return; // Fontos a return, hogy ne fusson tovább a kód
          }
          
          console.log("Van megfelelő jogosultság, folytatás...");
          fetchBookings();
        } else {
          console.log("Token dekódolás sikertelen");
          navigate('/login');
        }
      } catch (e) {
        console.error('Token dekódolási hiba részletei:', e);
        navigate('/login');
      }
    } else {
      console.log("Nincs token, átirányítás a bejelentkezési oldalra");
      navigate('/login');
    }
  }, [navigate]);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // JWT token kinyerése
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
      }
      
      // Összes foglalás lekérése
      const response = await fetch('https://localhost:5079/api/Foglalas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Foglalások részletes adatai:", JSON.stringify(data, null, 2));
      
      // Ellenőrizzük a szamlaId mezőt minden foglalásnál
      if (Array.isArray(data)) {
        data.forEach((booking, index) => {
          console.log(`Foglalás #${index + 1} - ID: ${booking.id}, Van szamlaId?: ${booking.szamlaId ? 'Igen' : 'Nem'}`);
        });
      }
      
      setBookings(data);
    } catch (err) {
      console.error('Foglalások betöltési hiba:', err);
      setError('Nem sikerült betölteni a foglalásokat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
      }
      
      const response = await fetch('https://localhost:5079/api/Felhasznalo/sajatSzamlak', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`HTTP hiba a számlák lekérésekor: ${response.status} - ${errorText}`);
        return; // Ne dobjon hibát, csak jelezze a konzolon
      }
      
      const data = await response.json();
      console.log("Számlák adatai:", data);
      setInvoices(data || []);
    } catch (err) {
      console.error('Számlák betöltési hiba:', err);
      setInvoices([]);
    }
  };



  // Vendég beléptetése (check-in)
  const handleCheckIn = async (foglalasId) => {
    try {
      setSuccessMessage('');
      setError('');
      
      // JWT token kinyerése
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
      }
      
      const response = await fetch(`https://localhost:5079/api/Recepcios/${foglalasId}/beleptetes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
      }
      
      setSuccessMessage(`A ${foglalasId} azonosítójú foglalás vendége sikeresen beléptetve!`);
      // Frissítsük a listát
      fetchBookings();
    } catch (err) {
      console.error('Beléptetés hiba:', err);
      setError('Hiba történt a beléptetés során: ' + err.message);
    }
  };

  // Foglalás visszaigazolása
  const handleConfirmBooking = async (foglalasId) => {
  try {
    setSuccessMessage('');
    setError('');
    
    // JWT token kinyerése
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
    }
    
    // MÓDOSÍTSD EZT A SORT:
    const response = await fetch(`https://localhost:5079/api/Recepcios/${foglalasId}/visszaigazolas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
    }
    
    setSuccessMessage(`A ${foglalasId} azonosítójú foglalás sikeresen visszaigazolva!`);
    // Frissítsük a listát
    fetchBookings();
  } catch (err) {
    console.error('Visszaigazolás hiba:', err);
    setError('Hiba történt a visszaigazolás során: ' + err.message);
  }
};

  // Számla készítése
  const handleCreateInvoice = async (foglalasId) => {
  try {
    setSuccessMessage('');
    setError('');
    
    // JWT token kinyerése
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
    }
    
    console.log(`Számla készítése a(z) ${foglalasId} foglaláshoz...`);
    
    // Ide kerül a megfelelő URL a számla létrehozásához
    const response = await fetch(`https://localhost:5079/api/Recepcios/szamlaAllitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ foglalasId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
    }
    
    // Kinyerjük a létrehozott számla adatait
    const invoiceData = await response.json();
    console.log("Számla létrehozva:", invoiceData);
    
    // Frissítsünk minden adatot
    await fetchBookings(); // Foglalások újra lekérése
    await fetchInvoices();  // Számlák újra lekérése
    
    // Frissítsük a bookings objektumot, hogy tartalmazza a számla ID-t
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === foglalasId 
          ? { ...booking, szamlaId: invoiceData.id } 
          : booking
      )
    );
    
    setSuccessMessage(`A ${foglalasId} azonosítójú foglalásról sikeresen elkészült a számla! (Számla ID: ${invoiceData.id})`);
    
    // Opcionális: átirányítás a számla megtekintésére
    // navigate(`/invoice/${invoiceData.id}`);
  } catch (err) {
    console.error('Számla készítési hiba:', err);
    setError('Hiba történt a számla készítése során: ' + err.message);
  }
};

  // Segédfüggvény a foglalás státuszának megjelenítéséhez
  const getStatusBadge = (booking) => {
    if (booking.belepve) {
      return <span className="badge bg-info">Beléptetve</span>;
    } else if (booking.visszaigazolva) {
      return <span className="badge bg-success">Visszaigazolva</span>;
    } else {
      return <span className="badge bg-warning">Függőben</span>;
    }
  };

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

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p>Foglalások betöltése...</p>
    </div>
  );

  return (
  <div className="container mt-5">
    <h2>Recepciós feladatok</h2>
    
    {error && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" onClick={() => setError('')}></button>
      </div>
    )}
    
    {successMessage && (
      <div className="alert alert-success alert-dismissible fade show" role="alert">
        {successMessage}
        <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
      </div>
    )}
    
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3>Foglalások kezelése</h3>
      <button className="btn btn-primary" onClick={fetchBookings}>
        <i className="bi bi-arrow-clockwise me-2"></i>Frissítés
      </button>
    </div>

    {/* Ellenőrizzük a bookings tömb hosszát */}
    {console.log("Renderelés: bookings hossza =", bookings?.length)}

    {bookings && bookings.length > 0 ? (
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Foglalás azonosító</th>
                  <th>Szoba</th>
                  <th>Érkezés</th>
                  <th>Távozás</th>
                  <th>Személyek</th>
                  <th>Állapot</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id || Math.random()}>
                    <td>{booking.id ? `#${booking.id}` : 'N/A'}</td>
                    <td>{booking.foglaltSzobaId ? `${booking.foglaltSzobaId}. szoba` : 'N/A'}</td>
                    <td>{formatDate(booking.erkezes)}</td>
                    <td>{formatDate(booking.tavozas)}</td>
                    <td>{booking.foSzam || 0} fő</td>
                    <td>{getStatusBadge(booking)}</td>
                    <td>
                        <div className="btn-group">
                            {!booking.visszaigazolva && (
                            <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleConfirmBooking(booking.id)}
                            >
                                Visszaigazolás
                            </button>
                            )}
                            
                            {booking.visszaigazolva && !booking.belepve && (
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleCheckIn(booking.id)}
                            >
                                Beléptetés
                            </button>
                            )}
                            
                            {/* Itt az a logika, hogy van-e számla a foglaláshoz */}
                            {booking.belepve && (() => {
                            // Keressük meg, van-e számla ehhez a foglaláshoz
                            const existingInvoice = invoices.find(inv => inv.foglalasId === booking.id);
                            
                            if (existingInvoice) {
                                // Ha van számla, megjelenítjük a Számla megtekintése gombot
                                return (
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => navigate(`/invoice/${existingInvoice.id}`)}
                                >
                                    Számla megtekintése
                                </button>
                                );
                            } else {
                                // Ha nincs számla, megjelenítjük a Számla készítés gombot
                                return (
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => handleCreateInvoice(booking.id)}
                                >
                                    Számla készítés
                                </button>
                                );
                            }
                            })()}
                        </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ) : (
      <div className="alert alert-info">
        Nincsenek aktív foglalások.
      </div>
    )}
  </div>
);
};

export default ReceptionistTasks;