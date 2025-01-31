import React from 'react'
import ReactDOM from 'react-dom/client'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 
import './NavBar.css';  // Importa il file CSS

function NavBar(){

    const navigate = useNavigate();

    // Controlla se il token è presente in localStorage
    const isLoggedIn = !!localStorage.getItem('token');
  
    // Funzione per il logout
    const handleLogout = () => {
      localStorage.removeItem('token'); // Rimuovi il token
      localStorage.removeItem('role'); // Rimuovi il ruolo
      navigate('/'); // Reindirizza alla home page
    };
  
    return (
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-link">
              <button className="navbar-button">HOME</button>
            </Link>
    
            {/* Se l'utente è loggato, mostriamo i bottoni per il logout e altre pagine */}
            {isLoggedIn ? (
              <div className="navbar-links">
                <button className="navbar-button" onClick={handleLogout}>
                  Logout
                </button>
                <Link to="/page1" className="navbar-link">
                  <button className="navbar-button">Pagina 1</button>
                </Link>
                <Link to="/page2" className="navbar-link">
                  <button className="navbar-button">Pagina 2</button>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="navbar-link">
                <button className="navbar-button">LOGIN</button>
              </Link>
            )}
          </div>
        </nav>
      );
}

export default NavBar
