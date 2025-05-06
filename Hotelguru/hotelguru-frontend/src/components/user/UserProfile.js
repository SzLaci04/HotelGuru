import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nev: '',
    email: '',
    lakcim: '',
    telefonszam: '',
    bankkartya: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await userService.getUserById(currentUser.id);
        setUserData(data);
        setFormData({
          nev: data.nev || '',
          email: data.email || '',
          lakcim: data.lakcim || '',
          telefonszam: data.telefonszam || '',
          bankkartya: data.bankkartya || ''
        });
      } catch (error) {
        setError('Hiba történt a felhasználói adatok betöltése közben.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
    
    try {
      await userService.updateUser(currentUser.id, formData);
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      setUpdateMessage('Profil sikeresen frissítve!');
    } catch (error) {
      setError('Hiba történt a profil frissítése közben.');
      console.error(error);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Kérjük, jelentkezzen be a profil megtekintéséhez.
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
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Felhasználói profil</h3>
            </div>
            
            <div className="card-body">
              {updateMessage && (
                <div className="alert alert-success mb-4">{updateMessage}</div>
              )}
              
              {isEditing ? (
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
                    <label htmlFor="bankkartya" className="form-label">Bankkártya</label>
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
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Mentés
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Mégse
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col-md-3 fw-bold">Név:</div>
                    <div className="col-md-9">{userData?.nev}</div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 fw-bold">Email cím:</div>
                    <div className="col-md-9">{userData?.email}</div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 fw-bold">Lakcím:</div>
                    <div className="col-md-9">{userData?.lakcim}</div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 fw-bold">Telefonszám:</div>
                    <div className="col-md-9">{userData?.telefonszam}</div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 fw-bold">Bankkártya:</div>
                    <div className="col-md-9">
                      {userData?.bankkartya ? `**** **** **** ${userData.bankkartya.slice(-4)}` : 'Nincs megadva'}
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-3 fw-bold">Szerep:</div>
                    <div className="col-md-9">
                      {userData?.szerep === 'admin' ? 'Adminisztrátor' : 
                       userData?.szerep === 'recepciós' ? 'Recepciós' : 'Vendég'}
                    </div>
                  </div>
                  
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Profil szerkesztése
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;