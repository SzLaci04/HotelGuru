import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

// Ezt a foglalási szolgáltatást implementálni kell még
// import reservationService from '../../services/reservationService';

const Reservations = () => {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReservations = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await reservationService.getUserReservations(currentUser.id);
        
        setReservations(data);
      } catch (error) {
        setError('Hiba történt a foglalások betöltése közben.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [currentUser, isAuthenticated]);
  
  const cancelReservation = async (id) => {
    if (!window.confirm('Biztosan törölni szeretné ezt a foglalást?')) {
      return;
    }
    
    try {
      // Valós implementációban:
      // await reservationService.cancelReservation(id);
      
      // Dummy implementáció:
      setReservations(reservations.filter(reservation => reservation.id !== id));
      alert('A foglalás sikeresen törölve!');
    } catch (error) {
      setError('Hiba történt a foglalás törlése közben.');
      console.error(error);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Kérjük, jelentkezzen be a foglalásai megtekintéséhez.
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <h2 className="mb-4">Foglalásaim</h2>
      
      {reservations.length === 0 ? (
        <div className="alert alert-info">
          Jelenleg nincs aktív foglalása. 
          <Link to="/rooms" className="alert-link ms-2">Böngéssze szobáinkat!</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Szoba neve</th>
                <th>Érkezés</th>
                <th>Távozás</th>
                <th>Éjszakák száma</th>
                <th>Ár/éj</th>
                <th>Teljes ár</th>
                <th>Állapot</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => {
                const startDate = new Date(reservation.kezdoDatum);
                const endDate = new Date(reservation.vegDatum);
                const nights = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={reservation.id}>
                    <td>
                      <Link to={`/rooms/${reservation.szobaId}`}>
                        {reservation.szobaNev}
                      </Link>
                    </td>
                    <td>{new Date(reservation.kezdoDatum).toLocaleDateString('hu-HU')}</td>
                    <td>{new Date(reservation.vegDatum).toLocaleDateString('hu-HU')}</td>
                    <td>{nights}</td>
                    <td>{reservation.ar.toLocaleString('hu-HU')} Ft</td>
                    <td>{(reservation.ar * nights).toLocaleString('hu-HU')} Ft</td>
                    <td>
                      <span className="badge bg-success">
                        {reservation.allapot}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cancelReservation(reservation.id)}
                      >
                        Lemondás
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reservations;