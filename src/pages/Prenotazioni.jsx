import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import './Prenotazioni.css'; // Importa il file CSS

const Prenotazioni = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Funzione per caricare le prenotazioni dell'utente
  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/miePrenotazioni?idUtente=${user.id}`)
      .then(response => setPrenotazioni(response.data))
      .catch(error => console.error('Errore nel recupero delle prenotazioni:', error));
  }, [user]);

  return (
    <div className="richieste-container">
      <NavBar />
      <h2>Le tue richieste di prenotazione</h2>

      {prenotazioni.length === 0 ? (
        <p className="no-prenotazioni">Nessuna prenotazione trovata.</p>
      ) : (
        <div className="prenotazioni-list">
          {prenotazioni.map(prenotazione => (
            <div key={prenotazione.idPrenotazione} className="prenotazione-card">
              <p><strong>Data:</strong> {prenotazione.dataAllenamento}</p>
              <p><strong>Ora:</strong> {prenotazione.oraInizio}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bottone per prenotare un nuovo allenamento */}
      <div className="button-container">
        <button className="btn-prenota-nuovo" onClick={() => navigate('/allenamenti')}>
          Prenota un nuovo allenamento
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Prenotazioni;
