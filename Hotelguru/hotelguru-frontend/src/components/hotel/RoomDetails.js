// src/components/hotel/RoomDetails.js
// Szoba részleteinek megtekintése és foglalás

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import roomService from '../../services/roomService';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingError, setBookingError] = useState('');
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const data = await roomService.getRoomById(id);
        setRoom(data);
      } catch (error) {
        setError('Hiba történt a szoba adatainak betöltése közben.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [id]);
  
  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Kérjük, jelentkezzen be a foglaláshoz!' } });
      return;
    }
    
    if (!startDate || !endDate) {
      setBookingError('Kérjük, adja meg az érkezés és távozás dátumát!');
      return;
    }
    
    // Dátumok ellenőrzése
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      setBookingError('Az érkezés dátuma nem lehet korábbi a mai napnál!');
      return;
    }
    
    if (end <= start) {
      setBookingError('A távozás dátuma későbbi kell legyen, mint az érkezés dátuma!');
      return;
    }
    
    try {
      // Itt történne a foglalás elküldése, ha a backend támogatja
      // const bookingData = {
      //   szobaId: room.id,
      //   felhasznaloId: currentUser.id,
      //   kezdoDatum: startDate,
      //   vegDatum: endDate
      // };
      // await bookingService.createBooking(bookingData);
      
      alert('A foglalás sikeresen megtörtént!');
      navigate('/reservations');
    } catch (error) {
      setBookingError(error.message || 'Hiba történt a foglalás során!');
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }
  
  if (!room) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Szoba nem található.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-4">{room.nev}</h2>
          
          <img
            src={room.kepUrl || "https://via.placeholder.com/800x400?text=Hotel+Szoba"}
            className="img-fluid rounded mb-4"
            alt={room.nev}
          />
          
          <div className="mb-4">
            <h4>Leírás</h4>
            <p>{room.leiras}</p>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <h4>Szoba adatai</h4>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Ár/éjszaka
                  <span className="badge bg-primary rounded-pill">{room.ar} Ft</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Férőhely
                  <span className="badge bg-primary rounded-pill">{room.ferohely} fő</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Állapot
                  <span className={`badge ${room.foglalt ? 'bg-danger' : 'bg-success'} rounded-pill`}>
                    {room.foglalt ? 'Foglalt' : 'Szabad'}
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h4>Szolgáltatások</h4>
              <ul className="list-group">
                {room.szolgaltatasok && room.szolgaltatasok.map((szolgaltatas, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    {szolgaltatas}
                  </li>
                ))}
                {(!room.szolgaltatasok || room.szolgaltatasok.length === 0) && (
                  <li className="list-group-item">Nincs megadva szolgáltatás</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">Foglalás</h4>
            </div>
            
            <div className="card-body">
              {room.foglalt ? (
                <div className="alert alert-danger">
                  Ez a szoba jelenleg foglalt. Kérjük, válasszon másik szobát.
                </div>
              ) : (
                <form onSubmit={handleBooking}>
                  {bookingError && (
                    <div className="alert alert-danger">{bookingError}</div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Érkezés napja</label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">Távozás napja</label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Ár/éjszaka:</span>
                      <span>{room.ar} Ft</span>
                    </div>
                    
                    {startDate && endDate && (
                      <>
                        <div className="d-flex justify-content-between">
                          <span>Éjszakák száma:</span>
                          <span>
                            {Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold mt-2">
                          <span>Teljes ár:</span>
                          <span>
                            {room.ar * Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} Ft
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!isAuthenticated || room.foglalt}
                  >
                    {isAuthenticated ? 'Foglalás' : 'Jelentkezzen be a foglaláshoz'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;