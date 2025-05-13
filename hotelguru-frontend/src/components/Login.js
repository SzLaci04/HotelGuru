import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("Bejelentkezési adatok küldése:", { email, jelszo: password });
      
      // Közvetlen fetch hívás
      try {
        const response = await fetch('https://localhost:5079/api/Felhasznalo/bejelentkez', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, jelszo: password })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch API Hiba:', response.status, errorText);
          throw new Error(`HTTP hiba: ${response.status} - ${errorText}`);
        }
        
        const token = await response.text();
        console.log('Bejelentkezés sikeres. Token:', token);
        
        // JWT token mentése
        localStorage.setItem('token', token);
        
        // Egyszerű felhasználói adatok mentése
        const userInfo = { email };
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        alert('Sikeres bejelentkezés!');
        navigate('/');
        return;
      } catch (fetchError) {
        console.error('Fetch API hiba részletei:', fetchError);
        setError('Hiba a bejelentkezés során: ' + fetchError.message);
      }
    } catch (err) {
      setError('Hiba történt a bejelentkezés során.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Bejelentkezés</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email cím</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Jelszó</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Betöltés...' : 'Bejelentkezés'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;