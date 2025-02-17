import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import NavBar from '../components/NavBar'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../style/GestioneRichieste.css' 

const GestioneRichieste = () => {
  // Recupera l'utente loggato dal contesto
  const { user } = useContext(AuthContext); // PT loggato
  const [richiesteInCorso, setRichiesteInCorso] = useState([]); // Stato per le richieste in corso
  const [richiesteCompletate, setRichiesteCompletate] = useState([]); // Stato per le richieste completate
  const navigate = useNavigate(); // Hook per la navigazione

  const location = useLocation(); // Ottieni la posizione attuale (utile per messaggi di stato)

  const [messageShown, setMessageShown] = useState(false); // Stato per controllare se il messaggio è già stato mostrato

  // useEffect per gestire la visualizzazione di un messaggio toast al cambio della posizione
  useEffect(() => {
    if (location.state && location.state.message && !messageShown) {
      toast.success(location.state.message); // Mostra il toast con il messaggio di successo
      setMessageShown(true); // Imposta che il messaggio è stato mostrato
    }
  }, [location, messageShown]); // Esegui quando cambia la posizione, ma solo se il messaggio non è già stato mostrato

  // useEffect per recuperare le richieste dell'utente loggato dal server
  useEffect(() => {
    if (user) {
      // Fai una richiesta GET per ottenere le richieste del personal trainer loggato
      axios.get(`http://localhost:5000/api/richiesta/richiestePT/${user.id}`)
        .then(response => {
          // Dividi le richieste in corso e completate
          const inCorso = response.data.filter(richiesta => richiesta.stato === "in corso");
          const completate = response.data.filter(richiesta => richiesta.stato === "completata");
          setRichiesteInCorso(inCorso); // Imposta le richieste in corso
          setRichiesteCompletate(completate); // Imposta le richieste completate
        })
        .catch(error => console.error("Errore nel recupero delle richieste:", error)); // Gestione degli errori
    }
  }, [user]); // Ricarica ogni volta che cambia l'utente

  // Funzione per gestire la richiesta, che naviga alla pagina di creazione della scheda
  const handleGestisciRichiesta = (idUtente, idRichiesta) => {
    navigate(`/crea-scheda/${idUtente}/${idRichiesta}`); // Naviga alla pagina per creare la scheda
  };

  return (
    <div className="gestione-container"> {/* Contenitore principale della pagina */}
      <NavBar /> {/* Include la barra di navigazione */}
      <h2>Gestione Richieste</h2> {/* Titolo della pagina */}

      {/* Sezione per le Richieste In Corso */}
      <h3>Richieste in corso</h3>
      <table border="1"> {/* Tabella per visualizzare le richieste in corso */}
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data Richiesta</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {richiesteInCorso.map((richiesta) => ( // Mappa le richieste in corso
            <tr key={richiesta.idRichiesta}>
              <td>{richiesta.nome} {richiesta.cognome}</td> {/* Nome e cognome del cliente */}
              <td>{new Date(richiesta.dataRichiesta).toLocaleDateString()}</td> {/* Data della richiesta */}
              <td>{richiesta.stato}</td> {/* Stato della richiesta */}
              <td>
                <button className="button-gestisci" onClick={() => handleGestisciRichiesta(richiesta.idUtente, richiesta.idRichiesta)}>
                  Gestisci Richiesta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sezione per le Richieste Completate */}
      <h3>Richieste completate</h3>
      <table border="1"> {/* Tabella per visualizzare le richieste completate */}
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data Richiesta</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {richiesteCompletate.map((richiesta) => ( // Mappa le richieste completate
            <tr key={richiesta.idRichiesta}>
              <td>{richiesta.nome} {richiesta.cognome}</td> {/* Nome e cognome del cliente */}
              <td>{new Date(richiesta.dataRichiesta).toLocaleDateString()}</td> {/* Data della richiesta */}
              <td>{richiesta.stato}</td> {/* Stato della richiesta */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toast per notificare messaggi di successo */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default GestioneRichieste;
