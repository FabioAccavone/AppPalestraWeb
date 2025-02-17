import { useState, useContext } from 'react'; 
import axios from 'axios'; 
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import '../style/Allenamenti.css'; 
import AllenamentoCard from '../components/AllenamentoCard';

// Componente principale per la pagina degli allenamenti
const Allenamenti = () => {
  // Stato per memorizzare l'elenco degli allenamenti disponibili
  const [allenamenti, setAllenamenti] = useState([]);
  // Stato per memorizzare la data selezionata dall'utente
  const [selectedDate, setSelectedDate] = useState('');
  // Recupera i dati dell'utente dal contesto di autenticazione
  const { user } = useContext(AuthContext);
  // Hook per la navigazione verso altre pagine
  const navigate = useNavigate();

  // Funzione per caricare gli allenamenti disponibili in base alla data selezionata
  const loadAllenamenti = () => {
    // Se non è stata selezionata una data, non fare nulla
    if (!selectedDate) return;

    // Effettua una richiesta GET al server per ottenere gli allenamenti disponibili
    axios
      .get(`http://localhost:5000/api/allenamenti/allenamentiDisponibili?data=${selectedDate}&idUtente=${user.id}`)
      .then(response => {
        // Se il server risponde con un messaggio (ad esempio nessun allenamento disponibile)
        if (response.data.message) {
          // Svuota l'elenco degli allenamenti
          setAllenamenti([]);
          // Mostra una notifica informativa all'utente
          toast.info(response.data.message);
        } else {
          // Altrimenti, aggiorna lo stato con gli allenamenti ricevuti
          setAllenamenti(response.data);
        }
      })
      .catch(error => console.error('Errore nel recupero degli allenamenti:', error));
  };

  // Funzione per prenotare un allenamento selezionato
  const handlePrenotazione = (idAllenamento) => {
    // Recupera l'idUtente dal contesto (user.id)
    const idUtente = user.id;

    // Effettua una richiesta POST al server per prenotare l'allenamento
    axios
      .post('http://localhost:5000/api/prenotazioni/prenotaAllenamento', { idUtente, idAllenamento })
      .then(() => {
        // Se la prenotazione ha successo, naviga alla pagina delle prenotazioni
        // Passando un messaggio di successo come stato
        navigate('/prenotazioni', { state: { message: 'Prenotazione effettuata con successo!' } });
      })
      .catch(() => 
        // Se si verifica un errore, mostra una notifica di errore
        toast.error('Errore nella prenotazione.')
      );
  };

  return (
    <div className="prenotazioni-container">
      {/* Componente di navigazione */}
      <NavBar />

      {/* Titolo e descrizione della pagina */}
      <h2 className="prenotazioni-titolo">Prenota il tuo Allenamento</h2>
      <p className="prenotazioni-sottotitolo">
        Seleziona la data per vedere gli allenamenti disponibili.
      </p>
      
      {/* Sezione per selezionare la data */}
      <div className="data-selezione">
        <label htmlFor="dataAllenamento" className="date-label">
          Seleziona una data:
        </label>
        <input
          type="date"
          id="dataAllenamento"
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {/* Bottone per cercare gli allenamenti disponibili per la data selezionata */}
        <button className="btn-cerca" onClick={loadAllenamenti}>
          Cerca
        </button>
      </div>

      {/* Sezione per mostrare l'elenco degli allenamenti */}
      <div className="allenamenti-list">
        {/* Se non ci sono allenamenti, non viene mostrato nulla */}
        {allenamenti.length === 0 ? (
          <></>
        ) : (
          // Se ci sono allenamenti, mappa ogni allenamento e lo visualizza tramite il componente AllenamentoCard
          allenamenti.map(allenamento => (
            <div key={allenamento.idAllenamento} className="allenamento-card">
              <AllenamentoCard
                key={allenamento.idAllenamento}
                allenamento={allenamento}
                handlePrenotazione={handlePrenotazione} // Passa la funzione di prenotazione al componente
              />
            </div>
          ))
        )}
      </div>
    
      {/* Componente per le notifiche toast */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Allenamenti;
