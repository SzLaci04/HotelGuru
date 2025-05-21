import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FoglalasAdmin() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
    try {
        setLoading(true);
        console.log("Összes foglalás lekérése...");
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Nincs bejelentkezve! Admin jogosultság szükséges.");
        }
        
        const response = await fetch('https://localhost:5079/api/Foglalas/admin/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API hiba:', response.status, errorText);
            
            if (response.status === 401) {
                throw new Error("Nincs jogosultsága ehhez a művelethez!");
            }
            
            throw new Error(`Szerver hiba: ${response.status}`);
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

    const handleHardDeleteBooking = async (id) => {
        if (window.confirm('Biztosan VÉGLEGESEN törölni szeretné ezt a foglalást? Ez a művelet nem vonható vissza!')) {
            try {
                setSuccessMessage('');
                setError('');

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Nincs bejelentkezve!");
                }

                const response = await fetch(`https://localhost:5079/api/Foglalas/admin/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Törlési hiba: ${response.status} - ${errorText}`);
                }

                setSuccessMessage(`A foglalás (ID: ${id}) véglegesen törölve az adatbázisból!`);

                fetchBookings();
            } catch (err) {
                console.error('Végleges törlési hiba:', err);
                setError(err.message || 'Ismeretlen hiba történt a foglalás végleges törlésekor');
            }
        }
    };

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

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Betöltés...</span>
                </div>
                <p className="mt-2">Foglalások betöltése...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="jumbotron">
                <h3 className="display-6">Foglalás adminisztráció</h3>

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
                    <h4>Összes foglalás</h4>
                    <button className="btn btn-primary" onClick={fetchBookings}>
                        Frissítés
                    </button>
                </div>

                {bookings && bookings.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Szoba ID</th>
                                    <th>Foglaló ID</th>
                                    <th>Érkezés</th>
                                    <th>Távozás</th>
                                    <th>Létszám</th>
                                    <th>Státusz</th>
                                    <th>Foglalás ideje</th>
                                    <th>Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{booking.foglaltSzobaId}</td>
                                        <td>{booking.foglaloId}</td>
                                        <td>{formatDate(booking.erkezes)}</td>
                                        <td>{formatDate(booking.tavozas)}</td>
                                        <td>{booking.foSzam} fő</td>
                                        <td>{getStatusBadge(booking)}</td>
                                        <td>{formatDate(booking.foglalasIdopontja)}</td>
                                        <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleHardDeleteBooking(booking.id)}
                                                    title="Foglalás végleges törlése az adatbázisból"
                                                >
                                                    Végleges törlés
                                                </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-info">
                        Nincsenek foglalások a rendszerben.
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoglalasAdmin;