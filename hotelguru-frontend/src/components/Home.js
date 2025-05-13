import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Üdvözöljük a HotelGuru oldalán!</h1>
        <p className="lead">
          A HotelGuru a tökéletes választás a kényelmes és gondtalan szállásfoglaláshoz.
        </p>
        <hr className="my-4" />
        <p>
          Böngésszen elérhető szobáink között és foglaljon egyszerűen, pár kattintással.
        </p>
        <div className="mt-4">
          {isAuthenticated ? (
            <Link to="/rooms" className="btn btn-primary btn-lg">
              Szobák böngészése
            </Link>
          ) : (
            <div className="d-flex gap-3">
              <Link to="/login" className="btn btn-primary btn-lg">
                Bejelentkezés
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-lg">
                Regisztráció
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Kényelmes szobák</h5>
              <p className="card-text">
                Különböző felszereltségű szobáinkban minden vendég megtalálja az igényeinek megfelelőt.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Egyszerű foglalás</h5>
              <p className="card-text">
                Foglaljon szobát néhány kattintással, bármikor, bárhonnan.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Plusz szolgáltatások</h5>
              <p className="card-text">
                Válassza ki a tartózkodáshoz illő plusz szolgáltatásainkat!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;