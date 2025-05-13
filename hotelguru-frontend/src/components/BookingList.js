import React, { useState, useEffect } from 'react';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("Foglalások lekérése...");
      
      // JWT token kinyerése
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve! Foglalások lekéréséhez be kell jelentkezni.");
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
        console.error('Fetch API hiba:', response.status, errorText);
        throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Foglalások adatai:", data);
      setBookings(data);
      setError('');
    } catch (err) {
      console.error('Foglalások betöltési hiba:', err);
      setError('Nem sikerült betölteni a foglalásokat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Biztosan lemondja a foglalást?')) {
      try {
        console.log(`Foglalás lemondása: ${id}`);
        
        // JWT token kinyerése
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
        fetchBookings(); // Frissítsük a listát
      } catch (err) {
        console.error('Foglalás lemondása hiba:', err);
        alert('Hiba történt a foglalás lemondása során: ' + (err.message || 'Ismeretlen hiba'));
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Betöltés...</div>;

  return (
    <div className="container mt-5">
      <h2>Foglalásaim</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {bookings && bookings.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Foglalás ID</th>
                <th>Szoba</th>
                <th>Érkezés</th>
                <th>Távozás</th>
                <th>Vendégek száma</th>
                <th>Visszaigazolva</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.foglaltSzobaId}</td>
                  <td>{booking.erkezes ? new Date(booking.erkezes).toLocaleDateString() : 'N/A'}</td>
                  <td>{booking.tavozas ? new Date(booking.tavozas).toLocaleDateString() : 'N/A'}</td>
                  <td>{booking.foSzam}</td>
                  <td>
                    {booking.visszaigazolva ? (
                      <span className="badge bg-success">Igen</span>
                    ) : (
                      <span className="badge bg-warning">Nem</span>
                    )}
                  </td>
                  <td>
                    {!booking.visszaigazolva && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Lemondás
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">Nincsenek aktív foglalásai.</div>
      )}
    </div>
  );
};

export default BookingList;