import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import NavBar from "../components/NavBar"; 
import "../style/MieSchede.css";

const MieSchede = () => {
  const [schede, setSchede] = useState([]); // Stato per memorizzare le schede di allenamento dell'utente
  const { user } = useContext(AuthContext); // Recupera l'utente loggato dal contesto di autenticazione
  const navigate = useNavigate(); // Hook per navigare tra le pagine

  useEffect(() => {
    if (!user) return; // Se l'utente non è loggato, non eseguire la richiesta

    // Effettua una richiesta GET per ottenere le schede di allenamento dell'utente
    axios
      .get(`http://localhost:5000/api/schede/mieSchede?idUtente=${user.id}`)
      .then((response) => setSchede(response.data)) // Salva le schede ottenute nel state
      .catch((error) =>
        console.error("Errore nel recupero delle schede:", error) // Gestisce gli errori di richiesta
      );
  }, [user]); // Esegui l'effetto ogni volta che l'utente cambia

  return (
    <div className="schede-container"> {/* Contenitore principale delle schede */}
      <NavBar /> {/* Barra di navigazione */}
      <h2>Le tue schede di allenamento</h2>

      {/* Se non ci sono schede, mostra il messaggio di nessuna scheda trovata */}
      {schede.length === 0 ? (
        <p className="no-schede">Nessuna scheda trovata.</p>
      ) : (
        <div className="schede-list"> {/* Lista delle schede */}
          {schede.map((scheda) => (
            <div
              key={scheda.idScheda} // Chiave univoca per ogni scheda
              className="scheda-card" // Classe per lo stile della card della scheda
              onClick={() => navigate(`/dettagli-scheda/${scheda.idScheda}`)} // Naviga alla pagina dei dettagli della scheda al clic
            >
              {/* Mostra la data di inizio e fine della scheda */}
              <p>
                <strong>Data Inizio:</strong> {scheda.dataInizio} -{" "}
                <strong>Data Fine:</strong> {scheda.dataFine}
              </p>
              {/* Mostra il nome del personal trainer */}
              <p>
                <strong>Personal Trainer:</strong> {scheda.nomePT}{" "}
                {scheda.cognomePT}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MieSchede;
