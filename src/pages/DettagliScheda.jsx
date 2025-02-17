import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";  
import "../style/DettagliScheda.css"; 

const DettagliScheda = () => {
  // Ottieni l'id della scheda dalla URL utilizzando i parametri della route
  const { idScheda } = useParams(); 
  // Stato per memorizzare i dettagli della scheda
  const [dettagli, setDettagli] = useState(null); 

  // Effetto per recuperare i dettagli della scheda quando il componente viene caricato
  useEffect(() => {
    // Effettua una richiesta GET per recuperare i dettagli della scheda dal backend
    axios
      .get(`http://localhost:5000/api/schede/dettagliScheda/${idScheda}`)
      .then((response) => {
        // Se la richiesta è andata a buon fine, salva i dati ricevuti nello stato
        setDettagli(response.data);
      })
      .catch((error) => {
        // In caso di errore, logga l'errore nella console
        console.error("Errore nel recupero dei dettagli:", error);
      });
  }, [idScheda]); // L'effetto dipende dall'idScheda, quindi verrà eseguito ogni volta che cambia

  // Se i dettagli non sono ancora stati caricati, mostra un messaggio di caricamento
  if (!dettagli) return <p className="loading">Caricamento in corso...</p>;

  // Quando i dettagli sono stati recuperati, rendi il contenuto della scheda
  return (
    <div className="dettagli-container">
      {/* Barra di navigazione */}
      <NavBar />
      {/* Titolo della pagina */}
      <h2>Dettagli della Scheda</h2>

      {/* Informazioni sull'utente, che includono nome, cognome e peso */}
      <p className="utente-info">
        <strong>Utente:</strong> {dettagli.nomeUtente} {dettagli.cognomeUtente} - <strong>Peso:</strong> {dettagli.pesoUtente} kg
      </p>

      {/* Informazioni sul personal trainer che ha creato la scheda */}
      <p className="pt-info">
        <strong>Personal Trainer:</strong> {dettagli.nomePT} {dettagli.cognomePT}
      </p>

      {/* Dettagli sulle date di inizio e fine della scheda */}
      <p className="date-info">
        <strong>Data Inizio:</strong> {dettagli.dataInizio} - <strong>Data Fine:</strong> {dettagli.dataFine}
      </p>

      {/* Sezione che mostra la lista degli esercizi associati alla scheda */}
      <h3>Esercizi</h3>
      <ul className="esercizi-list">
        {/* Mappa attraverso gli esercizi e visualizzali in una lista */}
        {dettagli.esercizi.map((esercizio, index) => (
          <li key={index}>
            {/* Mostra il nome dell'esercizio, il peso, le serie e le ripetizioni */}
            {esercizio.nome} - {esercizio.peso} kg - {esercizio.serie} serie - {esercizio.ripetizioni} ripetizioni
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DettagliScheda;
