import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [pluszSzolgaltatasok, setPluszSzolgaltatasok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Saját foglalások és plusz szolgáltatások lekérése...");
      
      // JWT token kinyerése
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve! Foglalások lekéréséhez be kell jelentkezni.");
      }
      
      
      const [bookingsResponse, servicesResponse] = await Promise.all([
        fetch('https://localhost:5079/api/Foglalas/SajatFoglalas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('https://localhost:5079/api/Szoba/pluszszolg', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      if (!bookingsResponse.ok) {
        const errorText = await bookingsResponse.text();
        console.error('Fetch API hiba:', bookingsResponse.status, errorText);
        
        
        if (bookingsResponse.status === 401) {
          
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alert('A munkamenet lejárt. Kérjük, jelentkezz be újra!');
          navigate('/login');
          return;
        }
        
        throw new Error(`HTTP hiba: ${bookingsResponse.status} - ${errorText}`);
      }
      
      if (!servicesResponse.ok) {
        const errorText = await servicesResponse.text();
        console.error('Plusz szolgáltatások lekérési hiba:', servicesResponse.status, errorText);
        
        console.warn('Plusz szolgáltatások nem érhetők el, de a foglalások megjelenítése folytatódik');
      } else {
        const servicesData = await servicesResponse.json();
        console.log("Plusz szolgáltatások:", servicesData);
        setPluszSzolgaltatasok(servicesData);
      }
      
      const bookingsData = await bookingsResponse.json();
      console.log("Saját foglalások adatai:", bookingsData);
      setBookings(bookingsData);
      setError('');
    } catch (err) {
      console.error('Saját foglalások betöltési hiba:', err);
      setError('Nem sikerült betölteni a foglalásokat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Biztosan lemondja a foglalást?')) {
      try {
        console.log(`Foglalás lemondása: ${id}`);
        
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Nincs bejelentkezve! Foglalás lemondásához be kell jelentkezni.");
        }
        
        const response = await fetch(`https://localhost:5079/api/Foglalas/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch API hiba:', response.status, errorText);
          throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
        }
        
        alert('A foglalás sikeresen lemondva!');
        fetchData(); 
      } catch (err) {
        console.error('Foglalás lemondása hiba:', err);
        alert('Hiba történt a foglalás lemondása során: ' + (err.message || 'Ismeretlen hiba'));
      }
    }
  };

  
  const getStatusBadge = (booking) => {
    if (booking.belepve) {
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

  
  const getServiceName = (serviceId) => {
    if (!pluszSzolgaltatasok || pluszSzolgaltatasok.length === 0) return 'Betöltés...';
    const service = pluszSzolgaltatasok.find(s => s.id === serviceId);
    return service ? service.szolgaltatasNeve : 'Nincs adat';
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p>Foglalások betöltése...</p>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Foglalásaim</h2>
        <button className="btn btn-primary" onClick={fetchData}>
          <i className="bi bi-arrow-clockwise me-2"></i>Frissítés
        </button>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}

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
                    <th>Plusz szolgáltatás</th>
                    <th>Állapot</th>
                    <th>Foglalás ideje</th>
                    <th>Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.foglaltSzobaId}. szoba</td>
                      <td>{formatDate(booking.erkezes)}</td>
                      <td>{formatDate(booking.tavozas)}</td>
                      <td>{booking.foSzam} fő</td>
                      <td>{getServiceName(booking.pluszSzolgId)}</td>
                      <td>{getStatusBadge(booking)}</td>
                      <td>{formatDate(booking.foglalasIdopontja)}</td>
                      <td>
                        {!booking.visszaigazolva && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Lemondás
                          </button>
                        )}
                        {booking.visszaigazolva && !booking.belepve && (
                          <span className="text-muted">Elfogadva</span>
                        )}
                        {booking.belepve && (
                          <span className="text-muted">Aktív</span>
                        )}
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
          <i className="bi bi-info-circle me-2"></i>
          Nincsenek aktív foglalásai. <a href="/rooms" className="alert-link">Foglaljon szobát</a> most!
        </div>
      )}
    </div>
  );
};

export default BookingList;