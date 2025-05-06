import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    nev: '',
    email: '',
    lakcim: '',
    telefonszam: '',
    bankkartya: '',
    jelszo: '',
    jelszoMegerosites: '',
    szerepId: 0 // Default: vendég
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Jelszó ellenőrzés
    if (formData.jelszo !== formData.jelszoMegerosites) {
      setErrorMessage('A jelszavak nem egyeznek!');
      return;
    }
    
    setLoading(true);
    
    try {
      // Jelszó megerősítés eltávolítása az adatokból
      const { jelszoMegerosites, ...registrationData } = formData;
      
      await authService.register(registrationData);
      navigate('/login', { state: { message: 'Sikeres regisztráció! Most már bejelentkezhet.' } });
    } catch (error) {
      setErrorMessage(error.message || 'Hiba történt a regisztráció során.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Regisztráció</h2>
              
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nev" className="form-label">Név</label>
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
                  <label htmlFor="jelszo" className="form-label">Jelszó</label>
                  <input
                    type="password"
                    className="form-control"
                    id="jelszo"
                    name="jelszo"
                    value={formData.jelszo}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="jelszoMegerosites" className="form-label">Jelszó megerősítése</label>
                  <input
                    type="password"
                    className="form-control"
                    id="jelszoMegerosites"
                    name="jelszoMegerosites"
                    value={formData.jelszoMegerosites}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Regisztráció...' : 'Regisztráció'}
                </button>
              </form>
              
              <div className="mt-3 text-center">
                <p>Már van fiókja? <Link to="/login">Bejelentkezés</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;