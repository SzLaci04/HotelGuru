import React, { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';

function FelhasznaloAdmin() {
    const [felhasznalok, setFelhasznalok] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(() => {
        fetchFelhasznalok();
        
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    localStorage.setItem('userEmail', payload.email || "");
                }
            } catch(e) {
                console.error('Token dekódolási hiba', e);
            }
        }
    }, []);

    const fetchFelhasznalok = async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log("Felhasználók lekérése...");
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Nincs bejelentkezve! Admin jogosultság szükséges.");
            }
            
            const response = await fetch('https://localhost:5079/api/Felhasznalo', {
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
            console.log("Felhasználók adatai:", data);
            
            setFelhasznalok(data);
            
        } catch (err) {
            console.error('Betöltési hiba:', err);
            setError(err.message || 'Ismeretlen hiba történt a felhasználók lekérésekor');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const userEmail = localStorage.getItem('userEmail');
        const userToDelete = felhasznalok.find(user => user.id === userId);
        
        if (userToDelete && userToDelete.email === userEmail) {
            setError("Nem törölheted saját magad!");
            return;
        }

        if (userToDelete && userToDelete.szerep === 2) {
            setError("Admin felhasználót nem lehet törölni!");
            return;
        }

        if (!window.confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) {
            return;
        }

        try {
            setError('');
            setSuccessMessage('');
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Nincs bejelentkezve!");
            }
            
            const response = await fetch(`https://localhost:5079/api/Felhasznalo/${userId}`, {
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
            
            setSuccessMessage(`A felhasználó (ID: ${userId}) sikeresen törölve!`);
            
            fetchFelhasznalok();
            
        } catch (err) {
            console.error('Törlési hiba:', err);
            setError(err.message || 'Ismeretlen hiba történt a felhasználó törlésekor');
        }
    };

    const getSzerepNev = (szerepId) => {
        if (szerepId === undefined || szerepId === null) {
            return "Nincs szerepkör";
        }

        const szerepSzam = parseInt(szerepId);
        
        switch (szerepSzam) {
            case 0:
                return "Vendég";
            case 1:
                return "Recepciós";
            case 2:
                return "Admin";
            default:
                return `Ismeretlen (${szerepId})`;
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Betöltés...</span>
                </div>
                <p className="mt-2">Felhasználók betöltése...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="jumbotron">
                <h3 className="display-6">Felhasználó kezelés</h3>
                
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
                    <h4>Felhasználók listája</h4>
                    <button className="btn btn-primary" onClick={fetchFelhasznalok}>
                        Frissítés
                    </button>
                </div>
                
                {felhasznalok && felhasznalok.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Név</th>
                                    <th>Email</th>
                                    <th>Telefonszám</th>
                                    <th>Szerepkör</th>
                                    <th>Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {felhasznalok.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.nev}</td>
                                        <td>{user.email}</td>
                                        <td>{user.telefonszam}</td>
                                        <td>{getSzerepNev(user.szerep)}</td>
                                        <td>
                                            {user.email === localStorage.getItem('userEmail') ? (
                                                <span className="text-muted">Saját fiók</span>
                                            ) : user.szerep === 2 ? (
                                                <span className="text-muted">Admin nem törölhető</span>
                                            ) : (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Törlés
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-info">
                        Nincsenek felhasználók a rendszerben.
                    </div>
                )}
            </div>
        </div>
    );
}

export default FelhasznaloAdmin;