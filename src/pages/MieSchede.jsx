import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../style/MieSchede.css"; // Stili CSS

const MieSchede = () => {
  const [schede, setSchede] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Recupera le schede dell'utente dall'API
    axios
      .get(`http://localhost:5000/api/schede/mieSchede?idUtente=${user.id}`)
      .then((response) => setSchede(response.data))
      .catch((error) =>
        console.error("Errore nel recupero delle schede:", error)
      );
  }, [user]);

  return (
    <div className="schede-container">
      <NavBar />
      <h2>Le tue schede di allenamento</h2>

      {schede.length === 0 ? (
        <p className="no-schede">Nessuna scheda trovata.</p>
      ) : (
        <div className="schede-list">
          {schede.map((scheda) => (
            <div
              key={scheda.idScheda}
              className="scheda-card"
              onClick={() => navigate(`/dettagli-scheda/${scheda.idScheda}`)}
            >
              <p>
                <strong>Data Inizio:</strong> {scheda.dataInizio} -{" "}
                <strong>Data Fine:</strong> {scheda.dataFine}
              </p>
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
