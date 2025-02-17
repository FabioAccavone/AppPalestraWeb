import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';  // Importa il contesto per gestire l'autenticazione dell'utente
import { useNavigate, useLocation } from 'react-router-dom';  // Funzioni per navigare tra le pagine
import { ToastContainer, toast } from 'react-toastify';  // Importa Toastify per visualizzare notifiche
import 'react-toastify/dist/ReactToastify.css';  // Importa il file di stile per Toastify
import NavBar from '../components/NavBar';  // Importa il componente NavBar
import PrenotazioneCard from '../components/PrenotazioneCard';  // Importa il componente PrenotazioneCard per visualizzare le prenotazioni
import '../style/Prenotazioni.css'; // Importa il file CSS

const Prenotazioni = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);  // Stato per memorizzare le prenotazioni dell'utente
  const { user } = useContext(AuthContext);  // Ottieni l'utente autenticato dal contesto
  const navigate = useNavigate();  // Funzione per navigare tra le pagine
  const location = useLocation();  // Ottieni la posizione attuale dell'utente
  const [messageShown, setMessageShown] = useState(false);  // Stato per tenere traccia se il messaggio di successo è stato già mostrato

  // Effettua una chiamata per mostrare un messaggio di successo se passato tramite lo stato di navigazione
  useEffect(() => {
    if (location.state && location.state.message && !messageShown) {
      toast.success(location.state.message);  // Mostra il toast con il messaggio di successo
      setMessageShown(true);  // Imposta che il messaggio è stato mostrato
    }
  }, [location, messageShown]);  // Esegui quando cambia la posizione, ma solo se il messaggio non è già stato mostrato

  // Funzione per caricare le prenotazioni dell'utente
  useEffect(() => {
    if (!user) return;  // Se l'utente non è loggato, non fare nulla

    axios.get(`http://localhost:5000/api/prenotazioni/miePrenotazioni?idUtente=${user.id}`)  // Richiesta per ottenere le prenotazioni
      .then(response => setPrenotazioni(response.data))  // Se la risposta è positiva, aggiorna lo stato delle prenotazioni
      .catch(error => console.error('Errore nel recupero delle prenotazioni:', error));  // Gestione degli errori
  }, [user]);  // Effettua la chiamata solo quando l'utente cambia

  // Funzione per cancellare una prenotazione
  const handleDelete = (idPrenotazione) => {
    axios
      .delete(`http://localhost:5000/api/prenotazioni/eliminaPrenotazione/${idPrenotazione}`)  // Richiesta per eliminare la prenotazione
      .then(() => {
        toast.success("Prenotazione cancellata con successo!");  // Mostra un messaggio di successo
        setPrenotazioni(prenotazioni.filter((p) => p.idPrenotazione !== idPrenotazione));  // Rimuove la prenotazione dalla lista
      })
      .catch(() => toast.error("Errore nella cancellazione della prenotazione."));  // Gestione degli errori
  };

  // Funzione per modificare una prenotazione (reindirizza a una pagina di modifica)
  const handleEdit = (idPrenotazione) => {
    navigate(`/modifica-prenotazione/${idPrenotazione}`);  // Naviga alla pagina di modifica
  };
  
  return (
    <div className="richieste-container">
      <NavBar />  // Aggiungi la barra di navigazione
      <h2>Le tue richieste di prenotazione</h2>

      {prenotazioni.length === 0 ? (  // Controlla se ci sono prenotazioni
        <p className="no-prenotazioni">Nessuna prenotazione trovata.</p>  // Se non ci sono prenotazioni, mostra un messaggio
      ) : (
        <div className="prenotazioni-list">  // Se ci sono prenotazioni, mostrerà una lista
          {prenotazioni.map(prenotazione => (
            <PrenotazioneCard key={prenotazione.idPrenotazione} prenotazione={prenotazione} 
              handleEdit={handleEdit} handleDelete={handleDelete} />  // Per ogni prenotazione, crea una PrenotazioneCard
          ))}
        </div>
      )}

      {/* Bottone per prenotare un nuovo allenamento */}
      <div className="button-container">
        <button className="btn-prenota-nuovo" onClick={() => navigate('/allenamenti')}>  // Bottone per navigare alla pagina degli allenamenti
          Prenota un nuovo allenamento
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />  // Configura il contenitore del toast
    </div>
  );
};

export default Prenotazioni; 
