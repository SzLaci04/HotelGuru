import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [pluszSzolgaltatasok, setPluszSzolgaltatasok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    foglaltSzobaId: parseInt(roomId),
    hitelesBankkartya: true,
    erkezes: new Date().toISOString().split('T')[0],
    tavozas: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    foSzam: 1,
    pluszSzolgId: 1, // Alapértelmezett érték, ezt majd felülírjuk a lekérés után
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Párhuzamos lekérések a szoba és a plusz szolgáltatások adataihoz
        const [roomResponse, serviceResponse] = await Promise.all([
          fetch(`https://localhost:5079/api/Szoba/${roomId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }),
          fetch('https://localhost:5079/api/Szoba/pluszszolg', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        // Szoba válasz feldolgozása
        if (!roomResponse.ok) {
          const errorText = await roomResponse.text();
          console.error('Szoba lekérési hiba:', roomResponse.status, errorText);
          throw new Error(`Szoba lekérési hiba: ${roomResponse.status} - ${errorText}`);
        }
        
        // Plusz szolgáltatások válasz feldolgozása
        if (!serviceResponse.ok) {
          const errorText = await serviceResponse.text();
          console.error('Plusz szolgáltatások lekérési hiba:', serviceResponse.status, errorText);
          throw new Error(`Plusz szolgáltatások lekérési hiba: ${serviceResponse.status} - ${errorText}`);
        }
        
        // Adatok feldolgozása
        const roomData = await roomResponse.json();
        const servicesData = await serviceResponse.json();
        
        console.log("Szoba adatok:", roomData);
        console.log("Plusz szolgáltatások:", servicesData);
        
        // Állapot frissítése
        setRoom(roomData);
        setPluszSzolgaltatasok(servicesData);
        
        // Ha van plusz szolgáltatás, akkor az elsőt alapértelmezettként beállítjuk
        if (servicesData && servicesData.length > 0) {
          setBookingData(prev => ({
            ...prev,
            pluszSzolgId: servicesData[0].id
          }));
        }
        
      } catch (err) {
        console.error('Adatok betöltési hiba:', err);
        setError(err.message || 'Nem sikerült betölteni az adatokat.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData({
      ...bookingData,
      [name]: type === 'checkbox' ? checked : 
              name === 'pluszSzolgId' ? parseInt(value) :
              name === 'foSzam' ? parseInt(value) : value
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
        foSzam: parseInt(bookingData.foSzam),
        pluszSzolgId: parseInt(bookingData.pluszSzolgId)
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

  // Számoljuk ki a várható végösszeget
  const calculateEstimatedPrice = () => {
    if (!room || !pluszSzolgaltatasok.length) return 0;
    
    // Naplózás a számításhoz
    console.log("Számolás bemeneti adatok:", {
      ejszakaAr: room.ejszakaAr,
      foSzam: bookingData.foSzam,
      erkezes: bookingData.erkezes,
      tavozas: bookingData.tavozas,
      pluszSzolgId: bookingData.pluszSzolgId
    });
    
    // Éjszakák számának kiszámolása
    const erkezes = new Date(bookingData.erkezes);
    const tavozas = new Date(bookingData.tavozas);
    const ejszakakSzama = Math.max(1, Math.floor((tavozas - erkezes) / (1000 * 60 * 60 * 24)));
    
    // Kiválasztott szolgáltatás árának megkeresése
    const kivalasztottSzolgaltatas = pluszSzolgaltatasok.find(
      szolg => szolg.id === parseInt(bookingData.pluszSzolgId)
    );
    const szolgaltatasAr = kivalasztottSzolgaltatas ? kivalasztottSzolgaltatas.szolgaltatasAra : 0;
    
    // Végösszeg kiszámolása: (éjszakák száma × szoba ára × vendégek száma) + szolgáltatás ára
    const szallasDij = ejszakakSzama * room.ejszakaAr * bookingData.foSzam;
    const vegosszeg = szallasDij + szolgaltatasAr;
    
    console.log("Számítás részletei:", {
      ejszakakSzama,
      szallasDij,
      szolgaltatasAr,
      vegosszeg
    });
    
    return new Intl.NumberFormat('hu-HU').format(vegosszeg);
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Betöltés...</span>
      </div>
      <p className="mt-2">Adatok betöltése...</p>
    </div>
  );
  
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!room) return <div className="alert alert-warning mt-5">A szoba nem található.</div>;

  return (
    <div className="container mt-5">
      <h2>Szoba foglalása</h2>
      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">{room.id}. szoba adatai</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <span className="fw-bold">Ágyak száma:</span> {room.agyakSzama}
              </div>
              <div className="mb-3">
                <span className="fw-bold">Ár/éjszaka:</span> {new Intl.NumberFormat('hu-HU').format(room.ejszakaAr)} Ft
              </div>
              <div className="mb-3">
                <span className="fw-bold">Felszereltség:</span> {room.felszereltseg}
              </div>
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold">Becsült végösszeg:</h6>
                <p className="fs-4 text-primary mb-0">{calculateEstimatedPrice()} Ft</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Foglalási adatok</h5>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
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
                  <div className="col-md-6 mb-3">
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
                  <small className="text-muted">Maximum {room.agyakSzama * 2} vendég foglalhat helyet.</small>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="pluszSzolgId" className="form-label">Plusz szolgáltatás</label>
                  <select
                    className="form-select"
                    id="pluszSzolgId"
                    name="pluszSzolgId"
                    value={bookingData.pluszSzolgId}
                    onChange={handleChange}
                    required
                  >
                    {pluszSzolgaltatasok.map(szolgaltatas => (
                      <option key={szolgaltatas.id} value={szolgaltatas.id}>
                        {szolgaltatas.szolgaltatasNeve} - {szolgaltatas.szolgaltatasAra} Ft
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Kiválasztott szolgáltatás részletei */}
                {pluszSzolgaltatasok.length > 0 && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h6 className="fw-bold mb-2">Kiválasztott szolgáltatás részletei:</h6>
                    {(() => {
                      const selectedService = pluszSzolgaltatasok.find(
                        szolg => szolg.id === parseInt(bookingData.pluszSzolgId)
                      );
                      
                      if (selectedService) {
                        return (
                          <div>
                            <p><strong>{selectedService.szolgaltatasNeve}</strong> - {new Intl.NumberFormat('hu-HU').format(selectedService.szolgaltatasAra)} Ft</p>
                            <p className="text-muted mb-0">{selectedService.szolgaltatasLeiras}</p>
                          </div>
                        );
                      }
                      return <p>Kérjük, válasszon szolgáltatást</p>;
                    })()}
                  </div>
                )}
                
                <div className="mb-4 form-check">
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

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Foglalás létrehozása
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;