import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Prenotazione.css'; // Importa un file CSS separato

const Prenotazioni = () => {
  const [allenamenti, setAllenamenti] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Funzione per caricare gli allenamenti disponibili
  const loadAllenamenti = () => {
    axios.get('http://localhost:5000/allenamentiDisponibili')
      .then(response => setAllenamenti(response.data))
      .catch(error => console.error('Errore nel recupero degli allenamenti:', error));
  };

  // Carica gli allenamenti disponibili all'avvio
  useEffect(() => {
    loadAllenamenti();
  }, []);

  // Funzione per prenotare un allenamento
  const handlePrenotazione = (idAllenamento) => {
    const idUtente = user.id; // Usa l'id dell'utente dal contesto

    axios.post('http://localhost:5000/prenotaAllenamento', { idUtente, idAllenamento })
      .then(() => {
        toast.success('Prenotazione effettuata con successo!');
        loadAllenamenti(); // Ricarica gli allenamenti dopo la prenotazione
      })
      .catch(() => toast.error('Errore nella prenotazione.'));
  };

  return (
    <div className="prenotazioni-container">
      <NavBar />
      <h2>Prenotazioni</h2>
      <p>Seleziona un allenamento disponibile.</p>

      <div className="allenamenti-list">
        {allenamenti.length === 0 ? (
          <p className="no-allenamenti">Nessun allenamento disponibile.</p>
        ) : (
          allenamenti.map(allenamento => (
            <div key={allenamento.idAllenamento} className="allenamento-card">
              <p><strong>Data:</strong> {allenamento.dataAllenamento}</p>
              <p><strong>Ora:</strong> {allenamento.oraInizio}</p>
              <p><strong>Posti Disponibili:</strong> {allenamento.numPosti}</p>
              <button 
                className="btn-prenota"
                onClick={() => handlePrenotazione(allenamento.idAllenamento)}
              >
                Prenota
              </button>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Prenotazioni;
