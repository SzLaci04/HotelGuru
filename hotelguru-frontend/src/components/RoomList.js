import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        console.log("Szobák lekérése...");
        
        // JWT token kinyerése, ha létezik
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Token hozzáadása, ha létezik
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Admin/recepciós jogosultságok ellenőrzése (a token dekódolása alapján)
        let isAdminOrReceptionist = false;
        if (token) {
          try {
            // JWT token dekódolása
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
              isAdminOrReceptionist = role === 'admin' || role === 'recepciós';
            }
          } catch (e) {
            console.error('Token dekódolási hiba:', e);
          }
        }
        
        // Endpoint kiválasztása
        // Ha admin/recepciós és nem jelölte be a csak elérhető szobákat, akkor minden szobát lekérünk
        // Egyébként csak az elérhető szobákat
        const endpoint = (isAdminOrReceptionist && !showOnlyAvailable) ? '' : 'available';
        const url = `https://localhost:5079/api/Szoba${endpoint ? `/${endpoint}` : ''}`;
        
        console.log("Kérés küldése:", url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch API hiba:', response.status, errorText);
          throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Szobák adatai:", data);
        
        // Már csak az engedélyezett szobákat jelenítjük meg
        setRooms(data);
        setError('');
      } catch (err) {
        console.error('Szobák betöltési hiba:', err);
        setError('Nem sikerült betölteni a szobákat: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [showOnlyAvailable]);

  // Szobastátusz enum érték szöveges megfelelője
  const getSzobaStatuszText = (status) => {
    console.log("Szoba státusz:", status, typeof status);
    
    // Ha szövegként érkezik, próbáljuk számmá konvertálni
    if (typeof status === 'string') {
      status = parseInt(status);
    }
    
    switch (status) {
      case 0:
        return 'Elérhető';
      case 1:
        return 'Foglalt';
      case 2:
        return 'Felújítás alatt';
      default:
        return `Ismeretlen (${status})`;
    }
  };

  if (loading) return <div className="text-center mt-5">Betöltés...</div>;

  return (
    <div className="container mt-5">
      <h2>Szobák listája</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {rooms && rooms.length > 0 ? (
          rooms.map(room => (
            <div className="col-md-4 mb-4" key={room.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{room.id}. szoba</h5>
                  <p className="card-text">Ágyak száma: {room.agyakSzama}</p>
                  <p className="card-text">Ár/éjszaka: {room.ejszakaAr} Ft</p>
                  <p className="card-text">Felszereltség: {room.felszereltseg}</p>
                  
                  {isAuthenticated ? (
                    <Link 
                      to={`/book-room/${room.id}`} 
                      className="btn btn-primary"
                    >
                      Foglalás
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      className="btn btn-secondary"
                    >
                      Bejelentkezés a foglaláshoz
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">Nincsenek megjeleníthető szobák.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;