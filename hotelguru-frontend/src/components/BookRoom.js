import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    foglaltSzobaId: parseInt(roomId),
    hitelesBankkartya: true,
    erkezes: new Date().toISOString().split('T')[0],
    tavozas: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    foSzam: 1
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        console.log(`Szoba adatainak lekérése: ${roomId}`);
        
        const response = await fetch(`https://localhost:5079/api/Szoba/${roomId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch API hiba:', response.status, errorText);
          throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Szoba adatai:", data);
        setRoom(data);
      } catch (err) {
        console.error('Szoba betöltési hiba:', err);
        setError(err.message || 'Nem sikerült betölteni a szoba adatait.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData({
      ...bookingData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log("Foglalás létrehozása:", bookingData);
      
      // JWT token kinyerése
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nincs bejelentkezve! Foglalás létrehozásához be kell jelentkezni.");
      }
      
      // Dátumok formázása a backend által várt formátumra
      const formattedData = {
        ...bookingData,
        foglalasIdopontja: new Date().toISOString(),
        erkezes: new Date(bookingData.erkezes).toISOString(),
        tavozas: new Date(bookingData.tavozas).toISOString(),
        foSzam: parseInt(bookingData.foSzam)
      };
      
      const response = await fetch('https://localhost:5079/api/Foglalas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch API hiba:', response.status, errorText);
        throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Foglalás sikeresen létrehozva:", data);
      
      alert('A foglalás sikeresen létrejött!');
      navigate('/bookings');
    } catch (err) {
      console.error('Foglalás létrehozása hiba:', err);
      setError('Hiba történt a foglalás során: ' + (err.message || 'Ismeretlen hiba'));
    }
  };

  if (loading) return <div className="text-center mt-5">Betöltés...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!room) return <div className="alert alert-warning mt-5">A szoba nem található.</div>;

  return (
    <div className="container mt-5">
      <h2>Szoba foglalása</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{room.id}. szoba adatai</h5>
              <p className="card-text">Ágyak száma: {room.agyakSzama}</p>
              <p className="card-text">Ár/éjszaka: {room.ejszakaAr} Ft</p>
              <p className="card-text">Felszereltség: {room.felszereltseg}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Foglalási adatok</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="erkezes" className="form-label">Érkezés dátuma</label>
                  <input
                    type="date"
                    className="form-control"
                    id="erkezes"
                    name="erkezes"
                    value={bookingData.erkezes}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tavozas" className="form-label">Távozás dátuma</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tavozas"
                    name="tavozas"
                    value={bookingData.tavozas}
                    onChange={handleChange}
                    min={bookingData.erkezes}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="foSzam" className="form-label">Vendégek száma</label>
                  <input
                    type="number"
                    className="form-control"
                    id="foSzam"
                    name="foSzam"
                    value={bookingData.foSzam}
                    onChange={handleChange}
                    min="1"
                    max={room.agyakSzama * 2}
                    required
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="hitelesBankkartya"
                    name="hitelesBankkartya"
                    checked={bookingData.hitelesBankkartya}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="hitelesBankkartya">
                    Elfogadom, hogy a bankkártyámat hitelesítik a foglaláshoz
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">Foglalás létrehozása</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;