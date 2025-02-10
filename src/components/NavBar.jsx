import React from 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa il contesto
import './NavBar.css';  // Importa il file CSS
import logo from '../assets/logo.svg'; // Assicurati di avere il logo in questa directory

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate('/', { state: { message: 'Logout successful!' } });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo a sinistra */}
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>

        {/* Link della navbar */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            <button className="navbar-button">HOME</button>
          </Link>
          {isLoggedIn ? (
            user.role === 'utente' ? (
              <div className="navbar-links-utente">
                <Link to="/prenotazioni" className="navbar-link">
                  <button className="navbar-button">Prenotazioni</button>
                </Link>
                <Link to="/schede" className="navbar-link">
                  <button className="navbar-button">Schede</button>
                </Link>
                <Link to="/anagrafica" className="navbar-link">
                  <button className="navbar-button">Anagrafica</button>
                </Link>
                <Link to="/richiesta-scheda" className="navbar-link">
                  <button className="navbar-button">Richiesta</button>
                </Link>
                <button className="navbar-button navbar-button-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : user.role === 'pt' ? (
              <div className="navbar-links-pt">
                <Link to="/gestione-richieste" className="navbar-link">
                  <button className="navbar-button">Gestisci Richieste</button>
                </Link>
                <button className="navbar-button navbar-button-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : user.role === 'admin' ? (
              <div className="navbar-links-admin">
                <Link to="/gestione-utenti" className="navbar-link">
                  <button className="navbar-button">Gestisci Utenti</button>
                </Link>
                <Link to="/gestione-pt" className="navbar-link">
                  <button className="navbar-button">Gestisci Pt</button>
                </Link>
                <button className="navbar-button navbar-button-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null
          ) : (
            <Link to="/login" className="navbar-link">
              <button className="navbar-button">LOGIN</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
