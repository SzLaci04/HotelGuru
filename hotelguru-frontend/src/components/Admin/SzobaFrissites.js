import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SzobaFrissites() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [roomData, setRoomData] = useState({
        agyakSzama: 1,
        ejszakaAr: 15000,
        statusz: "0",
        felszereltseg: ""
    });

    // Minden szoba betöltése
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setFetchLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
            }

            const response = await fetch("https://localhost:5079/api/Szoba", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Hiba a szobák lekérdezése során: ${response.status}`);
            }

            const data = await response.json();
            console.log("Lekért szobák:", data);
            setRooms(data);
            
            // Ha van szoba, akkor az elsőt választjuk ki alapértelmezetten
            if (data.length > 0) {
                setSelectedRoomId(data[0].id.toString());
                loadRoomData(data[0]);
            }
        } catch (err) {
            console.error("Hiba a szobák lekérdezése során:", err);
            setError(err.message || "Ismeretlen hiba történt a szobák lekérdezése során");
        } finally {
            setFetchLoading(false);
        }
    };

    // Szoba adatainak betöltése a form mezőkbe
    const loadRoomData = (room) => {
        setRoomData({
            agyakSzama: room.agyakSzama,
            ejszakaAr: room.ejszakaAr,
            statusz: typeof room.statusz === 'number' ? room.statusz.toString() : room.statusz,
            felszereltseg: room.felszereltseg || ""
        });
    };

    // Kiválasztott szoba változása
    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        setSelectedRoomId(roomId);
        
        // Megfelelő szoba megkeresése és betöltése
        const selectedRoom = rooms.find(room => room.id.toString() === roomId);
        if (selectedRoom) {
            loadRoomData(selectedRoom);
        }
    };

    // Form mező változások kezelése
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData({
            ...roomData,
            [name]: name === "agyakSzama" || name === "ejszakaAr" 
                ? parseInt(value) 
                : value
        });
    };

    // Form elküldése és szoba frissítése
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoomId) {
            setError("Kérjük válasszon ki egy szobát!");
            return;
        }

        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Nincs bejelentkezve vagy nincs megfelelő jogosultsága!");
            }

            // Adatok előkészítése - a backend SzobaUpdateDto struktúrát vár
            const requestData = {
                agyakSzama: parseInt(roomData.agyakSzama),
                ejszakaAr: parseInt(roomData.ejszakaAr),
                statusz: roomData.statusz, // Szöveg formátumban küldjük
                felszereltseg: roomData.felszereltseg
            };

            console.log(`Szoba frissítési adatok (ID: ${selectedRoomId}):`, requestData);

            const response = await fetch(`https://localhost:5079/api/Szoba/${selectedRoomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Hiba a szoba frissítése során: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Szoba sikeresen frissítve:", data);
            setSuccessMessage(`A szoba (ID: ${selectedRoomId}) sikeresen frissítve!`);
            
            // Frissítsük a szobák listáját
            fetchRooms();
        } catch (err) {
            console.error("Hiba a szoba frissítése során:", err);
            setError(err.message || "Ismeretlen hiba történt a szoba frissítése során");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="jumbotron">
                <h3 className="display-6">Szoba frissítése</h3>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
                    </div>
                )}

                {fetchLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Betöltés...</span>
                        </div>
                        <p className="mt-2">Szobák betöltése...</p>
                    </div>
                ) : (
                    <div className="row mt-4">
                        <div className="col-lg-6 col-md-8 mx-auto">
                            <div className="card">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="card-title mb-0">Szoba adatok szerkesztése</h5>
                                </div>
                                <div className="card-body">
                                    {rooms.length === 0 ? (
                                        <div className="alert alert-info">
                                            Nincsenek szobák a rendszerben. Hozzon létre először egy szobát!
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="roomSelect" className="form-label">Válasszon szobát:</label>
                                                <select 
                                                    className="form-select form-select-lg"
                                                    id="roomSelect"
                                                    value={selectedRoomId}
                                                    onChange={handleRoomChange}
                                                    required
                                                >
                                                    {rooms.map(room => (
                                                        <option key={room.id} value={room.id}>
                                                            {room.id}. szoba - {room.agyakSzama} ágy, {room.ejszakaAr} Ft/éj
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <hr className="my-4" />

                                            <div className="mb-3">
                                                <label htmlFor="agyakSzama" className="form-label">Ágyak száma:</label>
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    className="form-control" 
                                                    id="agyakSzama" 
                                                    name="agyakSzama" 
                                                    value={roomData.agyakSzama} 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="ejszakaAr" className="form-label">Egy éjszaka ára (Ft):</label>
                                                <input 
                                                    type="number" 
                                                    min="1000" 
                                                    className="form-control" 
                                                    id="ejszakaAr" 
                                                    name="ejszakaAr" 
                                                    value={roomData.ejszakaAr} 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="statusz" className="form-label">Státusz:</label>
                                                <select 
                                                    className="form-select" 
                                                    id="statusz" 
                                                    name="statusz" 
                                                    value={roomData.statusz} 
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="0">Elérhető</option>
                                                    <option value="2">Felújítás alatt</option>
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="felszereltseg" className="form-label">Felszereltség:</label>
                                                <textarea 
                                                    className="form-control" 
                                                    id="felszereltseg" 
                                                    name="felszereltseg" 
                                                    value={roomData.felszereltseg} 
                                                    onChange={handleChange}
                                                    rows="3"
                                                    required
                                                ></textarea>
                                                <small className="text-muted">Pl.: TV, WiFi, Fürdőszoba, Minibár, stb.</small>
                                            </div>

                                            <div className="d-grid gap-2 mt-4">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary" 
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Feldolgozás...
                                                        </>
                                                    ) : "Frissítés"}
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary" 
                                                    onClick={() => navigate("/admin")}
                                                >
                                                    Vissza az admin felületre
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default SzobaFrissites;