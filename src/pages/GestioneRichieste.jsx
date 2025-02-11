import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import { ToastContainer, toast } from 'react-toastify';  // Importa
import 'react-toastify/dist/ReactToastify.css'; // Stili

const GestioneRichieste = () => {
  const { user } = useContext(AuthContext); // PT loggato
  const [richiesteInCorso, setRichiesteInCorso] = useState([]);
  const [richiesteCompletate, setRichiesteCompletate] = useState([]);
  const navigate = useNavigate();

  const location = useLocation(); // Ottieni la posizione attuale

  const [messageShown, setMessageShown] = useState(false); // Stato per controllare se il messaggio è stato mostrato

  useEffect(() => {
    if (location.state && location.state.message && !messageShown) {
      toast.success(location.state.message); // Mostra il toast con il messaggio di successo
      setMessageShown(true); // Imposta che il messaggio è stato mostrato
    }
  }, [location, messageShown]); // Esegui quando cambia la posizione, ma solo se il messaggio non è già stato mostrato

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/richiesta/richiestePT/${user.id}`)
        .then(response => {
          // Dividiamo le richieste in base allo stato
          const inCorso = response.data.filter(richiesta => richiesta.stato === "in corso");
          const completate = response.data.filter(richiesta => richiesta.stato === "completata");
          setRichiesteInCorso(inCorso);
          setRichiesteCompletate(completate);
        })
        .catch(error => console.error("Errore nel recupero delle richieste:", error));
    }
  }, [user]);

  const handleGestisciRichiesta = (idUtente, idRichiesta) => {
    navigate(`/crea-scheda/${idUtente}/${idRichiesta}`);
  };

  return (
    <div>
      <NavBar />
      <h2>Gestione Richieste</h2>

      {/* Richieste In Corso */}
      <h3>Richieste in corso</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data Richiesta</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {richiesteInCorso.map((richiesta) => (
            <tr key={richiesta.idRichiesta}>
              <td>{richiesta.nome} {richiesta.cognome}</td>
              <td>{new Date(richiesta.dataRichiesta).toLocaleDateString()}</td>
              <td>{richiesta.stato}</td>
              <td>
                <button onClick={() => handleGestisciRichiesta(richiesta.idUtente, richiesta.idRichiesta)}>
                  Gestisci Richiesta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Richieste Completate */}
      <h3>Richieste completate</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data Richiesta</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {richiesteCompletate.map((richiesta) => (
            <tr key={richiesta.idRichiesta}>
              <td>{richiesta.nome} {richiesta.cognome}</td>
              <td>{new Date(richiesta.dataRichiesta).toLocaleDateString()}</td>
              <td>{richiesta.stato}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default GestioneRichieste;
