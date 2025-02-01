import React from 'react'
import ReactDOM from 'react-dom/client'
import  { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext'; // Importa il contesto
import './NavBar.css';  // Importa il file CSS

function NavBar(){

    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext); // Usa il contesto per ottenere l'utente

    // Controlla se il token è presente in localStorage
    const isLoggedIn = !!user; // Verifica se l'utente è loggato

  
    // Funzione per il logout
    const handleLogout = () => {
      logout(); //Elimino il contesto e il localStorage
      navigate('/',{ state: { message: 'Logout successful!' } }); // Reindirizza alla home page
    };
  
    return (
        <nav className="navbar">
          <span className="navbar-container">
            <Link to="/" className="navbar-link">
              <button className="navbar-button">HOME</button>
            </Link>
    
            {/* Se l'utente è loggato, mostriamo i bottoni per il logout e altre pagine */}
            {isLoggedIn ? (
              <span className="navbar-links">
                {// Se ha il ruolo di utente, mostriamo i bottoni della sua area personale
                  user.role === 'utente' ? (
                    <span className="navbar-links-utente">
                        <Link to="/prenotazioni" className="navbar-link">
                            <button className="navbar-button">Prenotazioni</button>
                        </Link>
                        <Link to="/schede" className="navbar-link">
                            <button className="navbar-button">Schede</button>
                        </Link>
                        <Link to="/anagrafica" className="navbar-link">
                            <button className="navbar-button">Anagrafica</button>
                        </Link>
                        <button className="navbar-button" onClick={handleLogout}>
                         Logout
                        </button>
                    </span>
                  /* Se ha il ruolo di utente, mostriamo i bottoni della sua area personale */
                ) : user.role === 'pt' ? (
                    <span className="navbar-links-pt">
                        <Link to="/gestisci-richieste" className="navbar-link">
                            <button className="navbar-button">Gestisci Richieste</button>
                        </Link>
                        <button className="navbar-button" onClick={handleLogout}>
                          Logout
                         </button>
                    </span>
                ) : null}
              </span>
              //Se non è loggato, mostriamo il bottone per  il Login
            ) : (
              <Link to="/login" className="navbar-link">
                <button className="navbar-button">LOGIN</button>
              </Link>
            )}
          </span>
        </nav>
      );
}

export default NavBar
