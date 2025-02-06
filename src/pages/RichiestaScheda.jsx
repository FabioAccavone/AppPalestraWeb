import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';

const RichiestaSchede = () => {
  const { user } = useContext(AuthContext);
  const [richieste, setRichieste] = useState([]);
  const [selectedPT, setSelectedPT] = useState(""); // ID del PT selezionato
  const [personalTrainers, setPersonalTrainers] = useState([]); // Lista dei PT

  // Carica le richieste dell'utente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/richiesta/${user.id}`)
      .then(response => setRichieste(response.data))
      .catch(error => console.error("Errore nel recupero delle richieste:", error));
  }, [user.id]);

  // Carica la lista dei PT
  useEffect(() => {
    axios.get("http://localhost:5000/api/richiesta/pt")
        .then(response => {
            console.log("Dati ricevuti:", response.data); // DEBUG
            setPersonalTrainers(response.data);
        })
        .catch(error => console.error("Errore nel recupero dei PT:", error));
}, []);


  // Funzione per inviare una nuova richiesta
  const handleSubmit = () => {
    if (!selectedPT) {
      toast.error("Seleziona un personal trainer");
      return;
    }

    axios.post("http://localhost:5000/api/richiesta/nuovaRichiesta", {
      Idutente: user.id,
      IdPt: selectedPT,
    })
    .then(() => {
      toast.success("Richiesta inviata con successo!");
      setRichieste([...richieste, { Idutente: user.id, IdPt: selectedPT, stato: "in corso" }]);
    })
    .catch(() => toast.error("Errore nell'invio della richiesta"));
  };

  return (
    <div>
      <NavBar />
      <h2>Richiesta Schede</h2>

      <div>
        <h3>Le mie richieste</h3>
        <ul>
          {richieste.map((richiesta, index) => (
            <li key={index}>PT: {richiesta.IdPt} - Stato: {richiesta.stato}</li>
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
