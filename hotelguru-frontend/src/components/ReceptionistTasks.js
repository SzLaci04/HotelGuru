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
  

  
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      
      await fetchBookings();
      
      
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
  console.log("Jogosultság ellenőrzés kezdete");
  
  
  const token = localStorage.getItem('token');
  console.log("Token létezik:", !!token);
  
  if (token) {
    try {
      
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("Teljes token payload:", payload);
        
        
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log("Felhasználói szerepkör:", role);
        
       
        const allowedRoles = ['recepció', 'recepcio', 'Recepció', 'admin', 'recepciÃ³s', 'Admin'];
        const hasAccess = allowedRoles.includes(role);
        console.log("Van jogosultsága:", hasAccess);
        
        if (!hasAccess) {
          console.log("Nincs megfelelő jogosultság, átirányítás a főoldalra");
          alert('Nincs megfelelő jogosultsága ennek az oldalnak a megtekintéséhez!');
          navigate('/');
          return;
        }
        
        console.log("Van megfelelő jogosultság, folytatás...");
        fetchBookings();
      } else {
        console.log("Token formátuma nem megfelelő");
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
      
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
      }
      
      
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
        return; 
      }
      
      const data = await response.json();
      console.log("Számlák adatai:", data);
      setInvoices(data || []);
    } catch (err) {
      console.error('Számlák betöltési hiba:', err);
      setInvoices([]);
    }
  };



  
  const handleCheckIn = async (foglalasId) => {
    try {
      setSuccessMessage('');
      setError('');
      
    
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
      
      fetchBookings();
    } catch (err) {
      console.error('Beléptetés hiba:', err);
      setError('Hiba történt a beléptetés során: ' + err.message);
    }
  };

  
  const handleConfirmBooking = async (foglalasId) => {
  try {
    setSuccessMessage('');
    setError('');
    
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
    }
    
    
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
   
    fetchBookings();
  } catch (err) {
    console.error('Visszaigazolás hiba:', err);
    setError('Hiba történt a visszaigazolás során: ' + err.message);
  }
};

  const handleRejectBooking = async (foglalasId) => {
    if (window.confirm('Biztosan visszautasítja a foglalást?')) {
      try {
        setSuccessMessage('');
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
        }
        
        const response = await fetch(`https://localhost:5079/api/Recepcios/${foglalasId}/visszautasitas`, {
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
        
        setSuccessMessage(`A ${foglalasId} azonosítójú foglalás sikeresen visszautasítva!`);
        
        fetchBookings();
      } catch (err) {
        console.error('Visszautasítás hiba:', err);
        setError('Hiba történt a visszautasítás során: ' + err.message);
      }
    }
  };
  
  const handleCreateInvoice = async (foglalasId) => {
  try {
    setSuccessMessage('');
    setError('');
    
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
    }
    
    console.log(`Számla készítése a(z) ${foglalasId} foglaláshoz...`);
    
    
    const requestData = { foglalasId: parseInt(foglalasId) };
    console.log("Küldött adatok:", JSON.stringify(requestData));
    
    const response = await fetch(`https://localhost:5079/api/Recepcios/szamlaAllitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    
    
    const responseText = await response.text();
    console.log(`Válasz (${response.status}):`, responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP hiba: ${response.status} - ${responseText}`);
    }
    
   
    let invoiceData;
    try {
      invoiceData = JSON.parse(responseText);
    } catch (e) {
      console.error("Válasz nem JSON formátumú:", e);
      throw new Error("A szerver nem JSON formátumú választ küldött");
    }
    
    console.log("Számla létrehozva:", invoiceData);
    
    
    await fetchBookings(); 
    await fetchInvoices();  
    
    setSuccessMessage(`A ${foglalasId} azonosítójú foglalásról sikeresen elkészült a számla!`);
  } catch (err) {
    console.error('Számla készítési hiba:', err);
    setError('Hiba történt a számla készítése során: ' + err.message);
  }
};

  
  // Frissített státusz badge függvény
  const getStatusBadge = (booking) => {
    if (booking.lemondva) {
      return <span className="badge bg-danger">Visszautasítva/Lemondva</span>;
    } else if (booking.belepve) {
      return <span className="badge bg-info">Beléptetve</span>;
    } else if (booking.visszaigazolva) {
      return <span className="badge bg-success">Visszaigazolva</span>;
    } else {
      return <span className="badge bg-warning">Függőben</span>;
    }
  };

  
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
                        {!booking.visszaigazolva && !booking.lemondva && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-1"
                              onClick={() => handleConfirmBooking(booking.id)}
                            >
                              Visszaigazolás
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRejectBooking(booking.id)}
                            >
                              Visszautasítás
                            </button>
                          </>
                        )}
                        
                        {booking.visszaigazolva && !booking.belepve && !booking.lemondva && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleCheckIn(booking.id)}
                          >
                            Beléptetés
                          </button>
                        )}
                        
                        {booking.belepve && !booking.lemondva && (() => {
                          
                          const existingInvoice = invoices.find(inv => inv && inv.foglalasId === booking.id);
                          
                          if (existingInvoice) {
                            
                            return (
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => navigate(`/invoice/${existingInvoice.id}`)}
                              >
                                Számla megtekintése
                              </button>
                            );
                          } else {
                            
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

                        {booking.lemondva && (
                          <span className="text-muted">Visszautasítva/Lemondva</span>
                        )}
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