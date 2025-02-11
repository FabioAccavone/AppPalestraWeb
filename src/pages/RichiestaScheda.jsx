import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';

const RichiestaScheda = () => {
  const { user } = useContext(AuthContext);
  const [richieste, setRichieste] = useState([]);
  const [selectedPT, setSelectedPT] = useState(""); // ID del PT selezionato
  const [personalTrainers, setPersonalTrainers] = useState([]); // Lista dei PT

  // Carica le richieste dell'utente
  useEffect(() => {

    if(user){
      axios.get(`http://localhost:5000/api/richiesta/richiesteUtente/${user.id}`)
      .then(response => setRichieste(response.data))
      .catch(error => console.error("Errore nel recupero delle richieste:", error));
    }

  }, [user]);

  // Carica la lista dei PT
  useEffect(() => {
    axios.get("http://localhost:5000/api/richiesta/pt")
        .then(response => {
            setPersonalTrainers(response.data);
        })
        .catch(error => console.error("Errore nel recupero dei PT:", error));
}, []);


  // Funzione per inviare una nuova richiesta
  const handleSubmit = () => {
    if (!user) {
      toast.error("Errore: Utente non autenticato.");
      return;
    }

    if (!selectedPT) {
      toast.error("Seleziona un personal trainer");
      return;
    }

    const requestData = {
      idUtente: user.id, // Nome corretto della chiave
      idPt: selectedPT
    };

    axios.post("http://localhost:5000/api/richiesta/nuovaRichiesta", requestData)
    .then(() => {
      toast.success("Richiesta inviata con successo!");
       // Creazione della data attuale
       const dataRichiesta = new Date().toLocaleDateString('it-IT'); // Oppure new Date().toLocaleString() per leggibilità
      setRichieste([...richieste, { Idutente: user.id, IdPt: selectedPT, stato: "in corso", dataRichiesta}]);
    })
    .catch((error) => toast.info(error.response.data.error));
  };

  return (
    <div>
      <NavBar />
      <h2>Richiesta Schede</h2>

      <div>
        <h3>Le mie richieste</h3>
        <ul>
          {richieste.map((richiesta, index) => (
            <li key={index}>PT: {richiesta.nome} {richiesta.cognome} - Stato: {richiesta.stato} - Data Richiesta: {richiesta.dataRichiesta} </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Nuova richiesta</h3>
        <label>Seleziona un personal trainer:</label>
        <select value={selectedPT} onChange={(e) => setSelectedPT(e.target.value)}>
          <option value="">-- Seleziona un PT --</option>
          {personalTrainers.map(pt => (
            <option key={pt.IdPt} value={pt.IdPt}>
              {pt.nome} {pt.cognome}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit}>Invia richiesta</button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default RichiestaScheda;
