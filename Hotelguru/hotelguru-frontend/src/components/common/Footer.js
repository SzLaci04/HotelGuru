import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>HotelGuru</h5>
            <p>A tökéletes szállás foglalási rendszer</p>
          </div>
          <div className="col-md-3">
            <h5>Linkek</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Főoldal</a></li>
              <li><a href="/rooms" className="text-light">Szobák</a></li>
              <li><a href="/about" className="text-light">Rólunk</a></li>
              <li><a href="/contact" className="text-light">Kapcsolat</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Kapcsolat</h5>
            <address>
              <p>Budapest, Példa utca 1.</p>
              <p>Email: info@hotelguru.com</p>
              <p>Tel: +36 1 234 5678</p>
            </address>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <p className="mb-0">&copy; {currentYear} HotelGuru. Minden jog fenntartva.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
