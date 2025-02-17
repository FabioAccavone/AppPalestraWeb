import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar'; 
import '../style/RichiestaScheda.css';

const RichiestaScheda = () => {
  const { user } = useContext(AuthContext);  // Ottiene l'utente loggato dal contesto
  const [richieste, setRichieste] = useState([]);  // Stato per memorizzare le richieste dell'utente
  const [selectedPT, setSelectedPT] = useState("");  // Stato per memorizzare l'ID del PT selezionato
  const [personalTrainers, setPersonalTrainers] = useState([]);  // Stato per memorizzare la lista dei personal trainer

  // Carica le richieste dell'utente quando l'utente è autenticato
  useEffect(() => {
    if(user) {  // Verifica se l'utente è loggato
      axios.get(`http://localhost:5000/api/richiesta/richiesteUtente/${user.id}`)  // Richiesta per ottenere le richieste dell'utente
        .then(response => setRichieste(response.data))  // Se la risposta è positiva, aggiorna lo stato delle richieste
        .catch(error => console.error("Errore nel recupero delle richieste:", error));  // Gestione degli errori
    }
  }, [user, richieste]);  // Esegui quando l'utente o le richieste cambiano

  // Carica la lista dei personal trainer
  useEffect(() => {
    axios.get("http://localhost:5000/api/richiesta/pt")  // Richiesta per ottenere la lista dei PT
      .then(response => setPersonalTrainers(response.data))  // Se la risposta è positiva, aggiorna lo stato dei PT
      .catch(error => console.error("Errore nel recupero dei PT:", error));  // Gestione degli errori
  }, []);  // Esegui solo una volta al caricamento della pagina

  // Funzione per inviare una nuova richiesta
  const handleSubmit = () => {
    if (!user) {  // Se l'utente non è loggato, mostra un errore
      toast.error("Errore: Utente non autenticato.");
      return;
    }

    if (!selectedPT) {  // Se non è stato selezionato un PT, mostra un errore
      toast.error("Seleziona un personal trainer");
      return;
    }

    const requestData = {
      idUtente: user.id,  // ID dell'utente loggato
      idPt: selectedPT  // ID del personal trainer selezionato
    };

    axios.post("http://localhost:5000/api/richiesta/nuovaRichiesta", requestData)  // Invia la richiesta al server
      .then(() => {
        toast.success("Richiesta inviata con successo!");  // Mostra un messaggio di successo se la richiesta è stata inviata correttamente
        //e([...richieste, { Idutente: user.id, nomePt: selectedPT, stato: "in corso", dataRichiesta}]);  // Qui si potrebbe aggiornare lo stato delle richieste
      })
      .catch((error) => toast.info(error.response.data.error));  // Mostra il messaggio di errore ricevuto dal server
  };

  return (
    <div className="richiesta-container">
      <NavBar />  // Barra di navigazione

      <h2>Richiesta Schede</h2>  // Titolo della pagina

      {/* BOX LE MIE RICHIESTE */}
      <div className="richieste-box">
        <h3>Le mie richieste</h3>  // Intestazione per le richieste dell'utente
        <ul className="richieste-list">  // Lista delle richieste
          {richieste.map((richiesta, index) => (
            <li key={index} className="richiesta-item">
              PT: {richiesta.nome} {richiesta.cognome} - 
              Stato: {richiesta.stato} - 
              Data Richiesta: {richiesta.dataRichiesta}
            </li>  // Ogni richiesta viene visualizzata in un elemento della lista
          ))}
        </ul>
      </div>

      {/* BOX NUOVA RICHIESTA */}
      <div className="nuova-richiesta-box">
        <h3>Nuova richiesta</h3>  // Intestazione per il form di nuova richiesta
        <label>Seleziona un personal trainer:</label>  // Etichetta per il selettore dei PT
        <select
          className="select-pt"  // Classe per lo stile del selettore
          value={selectedPT}  // Imposta il valore selezionato
          onChange={(e) => setSelectedPT(e.target.value)}  // Aggiorna il valore del PT selezionato
        >
          <option value="">-- Seleziona un PT --</option>  // Opzione predefinita
          {personalTrainers.map((pt) => (
            <option key={pt.IdPt} value={pt.IdPt}>
              {pt.nome} {pt.cognome}
            </option>  // Ogni PT viene aggiunto come opzione nel menu a tendina
          ))}
        </select>

        <button className="button-invia" onClick={handleSubmit}>  // Bottone per inviare la richiesta
          Invia richiesta
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />  // Contenitore per i toast
    </div>
  );
};

export default RichiestaScheda;
