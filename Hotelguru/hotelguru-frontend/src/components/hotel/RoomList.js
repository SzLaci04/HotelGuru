import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import roomService from '../../services/roomService';
import LoadingSpinner from '../common/LoadingSpinner';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAllRooms();
        setRooms(data);
      } catch (error) {
        setError('Hiba történt a szobák betöltése közben.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <h2 className="mb-4">Szobáink</h2>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {rooms.map(room => (
          <div className="col" key={room.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={room.kepUrl || "https://via.placeholder.com/300x200?text=Hotel+Szoba"}
                className="card-img-top"
                alt={room.nev}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              
              <div className="card-body">
                <h5 className="card-title">{room.nev}</h5>
                <p className="card-text">{room.leiras}</p>
                <ul className="list-unstyled">
                  <li><strong>Ár:</strong> {room.ar} Ft/éj</li>
                  <li><strong>Férőhely:</strong> {room.ferohely} fő</li>
                  <li><strong>Foglaltság:</strong> {room.foglalt ? 'Foglalt' : 'Szabad'}</li>
                </ul>
              </div>
              
              <div className="card-footer bg-white border-top-0">
                <Link to={`/rooms/${room.id}`} className="btn btn-primary w-100">
                  Részletek megtekintése
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="alert alert-info mt-4">
          Jelenleg nincs elérhető szoba.
        </div>
      )}
    </div>
  );
};

export default RoomList;
