import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';

const GestioneRichieste = () => {
  const { user } = useContext(AuthContext); // Il PT loggato
  const [richieste, setRichieste] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/richiesta/richiestePT/${user.id}`)
        .then(response => setRichieste(response.data))
        .catch(error => console.error("Errore nel recupero delle richieste:", error));
    }
  }, [user]);

  const handleGestisciRichiesta = (idUtente) => {
    navigate(`/crea-scheda/${idUtente}`);
  };

  return (
    <div>
      <NavBar />
      <h2>Gestione Richieste</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {richieste.map((richiesta) => (
            <tr key={richiesta.idRichiesta}>
              <td>{richiesta.nome} {richiesta.cognome}</td>
              <td>{richiesta.stato}</td>
              <td>
                <button onClick={() => handleGestisciRichiesta(richiesta.idUtente)}>
                  Gestisci Richiesta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestioneRichieste;
