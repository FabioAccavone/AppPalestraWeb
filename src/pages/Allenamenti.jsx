import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Allenamenti.css'; // Importa un file CSS separato
import AllenamentoCard from '../components/AllenamentoCard';

const Allenamenti = () => {

  const [allenamenti, setAllenamenti] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Nuovo stato per controllare se è stata fatta una ricerca
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Funzione per caricare gli allenamenti disponibili
  const loadAllenamenti = () => {
    if (!selectedDate) return;

    axios.get(`http://localhost:5000/api/allenamenti/allenamentiDisponibili?data=${selectedDate}&idUtente=${user.id}`)
    .then(response => {
      if (response.data.message) {
        setAllenamenti([]);
        toast.info(response.data.message); // Mostra una notifica
      } else {
        setAllenamenti(response.data);
      }
    })
    .catch(error => console.error('Errore nel recupero degli allenamenti:', error));
  };

  // Funzione per prenotare un allenamento
  const handlePrenotazione = (idAllenamento) => {
    const idUtente = user.id; // Usa l'id dell'utente dal contesto

    axios.post('http://localhost:5000/api/prenotazioni/prenotaAllenamento', { idUtente, idAllenamento })
      .then(() => {
        toast.success('Prenotazione effettuata con successo!');
      })
      .catch(() => toast.error('Errore nella prenotazione.'));
  };

  return (
    <div className="prenotazioni-container">
      <NavBar />
      <h2 className="prenotazioni-titolo">Prenota il tuo Allenamento</h2>
      <p className="prenotazioni-sottotitolo">Seleziona la data per vedere gli allenamenti disponibili.</p>
      
      <div className="data-selezione">
        <label htmlFor="dataAllenamento" className="date-label">Seleziona una data:</label>
        <input
          type="date"
          id="dataAllenamento"
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="btn-cerca" onClick={loadAllenamenti}>Cerca</button>
      </div>

      <div className="allenamenti-list">
        {allenamenti.length === 0 ? (<></>
        ) : (
          allenamenti.map(allenamento => (
            <div key={allenamento.idAllenamento} className="allenamento-card">
              <AllenamentoCard
               key={allenamento.idAllenamento}
              allenamento={allenamento}
               handlePrenotazione={handlePrenotazione}
            />
            </div>
          ))
        )}
      </div>
    
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Allenamenti;
