import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';

const Register = () => {
  const [formData, setFormData] = useState({
    nev: '',
    email: '',
    jelszo: '',
    lakcim: '',
    telefonszam: '',
    bankkartya: '',
    szerepId: 0 // Alapértelmezetten vendég
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Adatok előkészítése
      const apiFormData = {
        ...formData,
        szerepId: parseInt(formData.szerepId)
      };

      console.log("Regisztráció adatok:", apiFormData);
      
      // Közvetlen fetch hívás
      try {
        const response = await fetch('https://localhost:5079/api/Felhasznalo/regisztral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiFormData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch API Hiba:', response.status, errorText);
          throw new Error(`HTTPS hiba: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Regisztráció sikeres:', data);
        alert('Sikeres regisztráció! Most már bejelentkezhet.');
        navigate('/login');
        return;
      } catch (fetchError) {
        console.error('Fetch API hiba részletei:', fetchError);
        setError('Hiba a regisztráció során: ' + fetchError.message);
      }
    } catch (err) {
      console.error('Regisztrációs hiba részletei:', err);
      setError('Hiba történt a regisztráció során: ' + (err.message || 'Ismeretlen hiba'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Regisztráció</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nev" className="form-label">Teljes név</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nev"
                    name="nev"
                    value={formData.nev}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email cím</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="jelszo" className="form-label">Jelszó</label>
                  <input
                    type="password"
                    className="form-control"
                    id="jelszo"
                    name="jelszo"
                    value={formData.jelszo}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lakcim" className="form-label">Lakcím</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lakcim"
                    name="lakcim"
                    value={formData.lakcim}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefonszam" className="form-label">Telefonszám</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefonszam"
                    name="telefonszam"
                    value={formData.telefonszam}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bankkartya" className="form-label">Bankkártya szám</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bankkartya"
                    name="bankkartya"
                    value={formData.bankkartya}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="szerepId" className="form-label">Felhasználói típus</label>
                  <select
                    className="form-select"
                    id="szerepId"
                    name="szerepId"
                    value={formData.szerepId}
                    onChange={handleChange}
                  >
                    <option value="0">Vendég</option>
                    <option value="1">Recepciós</option>
                    <option value="2">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Betöltés...' : 'Regisztráció'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;