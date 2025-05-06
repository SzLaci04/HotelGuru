import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    
    try {
      await login(email, jelszo);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message || 'Hibás email vagy jelszó!');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Bejelentkezés</h2>
              
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              
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
                  <label htmlFor="jelszo" className="form-label">Jelszó</label>
                  <input
                    type="password"
                    className="form-control"
                    id="jelszo"
                    value={jelszo}
                    onChange={(e) => setJelszo(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                </button>
              </form>
              
              <div className="mt-3 text-center">
                <p>Nincs még fiókja? <Link to="/register">Regisztráció</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;