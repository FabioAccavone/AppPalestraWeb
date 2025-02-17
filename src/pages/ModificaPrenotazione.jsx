import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; 
import { AuthContext } from '../context/AuthContext'; 
import NavBar from "../components/NavBar"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import '../style/ModificaPrenotazione.css'

const ModificaPrenotazione = () => {
  const { idPrenotazione } = useParams(); // Ottiene l'ID della prenotazione dalla URL
  const [selectedDate, setSelectedDate] = useState(''); // Stato per memorizzare la data selezionata
  const [allenamenti, setAllenamenti] = useState([]); // Stato per memorizzare gli allenamenti disponibili
  const [selectedAllenamento, setSelectedAllenamento] = useState(""); // Stato per memorizzare l'allenamento selezionato
  const { user } = useContext(AuthContext); // Recupera l'utente loggato dal contesto di autenticazione
  const navigate = useNavigate(); // Hook per navigare tra le pagine

  // Carica gli allenamenti disponibili in base alla data selezionata
  useEffect(() => {
    if (!selectedDate) {
      setAllenamenti([]); // Svuota la lista se la data viene rimossa
      return;
    }

    // Effettua una richiesta GET per recuperare gli allenamenti disponibili per la data e l'utente selezionati
    axios.get(`http://localhost:5000/api/allenamenti/allenamentiDisponibiliModifica?data=${selectedDate}&idUtente=${user.id}`)
      .then(response => {
        if (response.data.message) {
          setAllenamenti([]); // Se non ci sono allenamenti, svuota la lista
          toast.info("Nessun allenamento disponibile per questa data."); // Mostra una notifica
        } else {
          setAllenamenti(response.data); // Popola la lista con gli allenamenti ricevuti
        }
      })
      .catch(error => console.error('Errore nel recupero degli allenamenti:', error)); // Gestisce eventuali errori
  }, [selectedDate]); // Esegui ogni volta che la data selezionata cambia

  // Funzione per confermare la modifica della prenotazione
  const handleUpdate = () => {
    // Effettua una richiesta PUT per modificare la prenotazione
    axios
      .put(`http://localhost:5000/api/prenotazioni/modificaPrenotazione/${idPrenotazione}`, {
        idAllenamento: selectedAllenamento // Invia l'ID dell'allenamento selezionato
      })
      .then(() => {
        // Se la modifica va a buon fine, naviga alla pagina delle prenotazioni con un messaggio di successo
        navigate('/prenotazioni', { state: { message: 'Prenotazione aggiornata con successo!' } });
      })
      .catch(() => toast.error("Errore nella modifica della prenotazione.")); // Mostra un errore in caso di fallimento
  };

  return (
    <div className="modifica-prenotazione-container"> {/* Contenitore principale per la pagina */}
      <NavBar /> {/* Barra di navigazione */}
      <h2>Modifica Prenotazione</h2>

      <div className="form-group">
        <div className="data-selezione">
          <label htmlFor="dataAllenamento" className="date-label">Seleziona una data:</label>
          <input
            type="date"
            id="dataAllenamento" 
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} // Imposta la data selezionata
          />
        </div>
        
        <label htmlFor="dataAllenamento" className="date-label">Seleziona una nuova Ora:</label>
        <select value={selectedAllenamento} onChange={(e) => setSelectedAllenamento(e.target.value)}>
          <option value="">-- Seleziona --</option>
          {allenamenti.map((allenamento) => (
            <option key={allenamento.idAllenamento} value={allenamento.idAllenamento}>
              {allenamento.oraInizio} {/* Mostra le opzioni di allenamento disponibili con l'ora di inizio */}
            </option>
          ))}
        </select>
      </div>

      <button className="btn-update" onClick={handleUpdate}>Conferma Modifica</button> {/* Bottone per confermare la modifica */}
      <button className="btn-cancel" onClick={() => navigate("/prenotazioni")}>Annulla</button> {/* Bottone per annullare e tornare alla lista prenotazioni */}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Toast per notifiche */}
    </div>
  );
};

export default ModificaPrenotazione; 
