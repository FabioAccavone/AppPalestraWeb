import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModificaPrenotazione = () => {
  const { idPrenotazione } = useParams();
  const [allenamenti, setAllenamenti] = useState([]);
  const [selectedAllenamento, setSelectedAllenamento] = useState("");
  const navigate = useNavigate();

  // Carica gli allenamenti disponibili
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/allenamenti/allenamentiDisponibili")
      .then((response) => setAllenamenti(response.data))
      .catch((error) => console.error("Errore nel recupero degli allenamenti:", error));
  }, []);

  // Funzione per confermare la modifica della prenotazione
  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/api/prenotazioni/modificaPrenotazione/${idPrenotazione}`, {
        idAllenamento: selectedAllenamento,
      })
      .then(() => {
        toast.success("Prenotazione aggiornata con successo!");
        navigate("/prenotazioni");
      })
      .catch(() => toast.error("Errore nella modifica della prenotazione."));
  };

  return (
    <div className="modifica-prenotazione-container">
      <NavBar />
      <h2>Modifica Prenotazione</h2>
      
      <div className="form-group">
        <label>Seleziona un nuovo allenamento:</label>
        <select value={selectedAllenamento} onChange={(e) => setSelectedAllenamento(e.target.value)}>
          <option value="">-- Seleziona --</option>
          {allenamenti.map((allenamento) => (
            <option key={allenamento.idAllenamento} value={allenamento.idAllenamento}>
              {allenamento.dataAllenamento} - {allenamento.oraInizio}
            </option>
          ))}
        </select>
      </div>

      <button className="btn-update" onClick={handleUpdate}>Conferma Modifica</button>
      <button className="btn-cancel" onClick={() => navigate("/prenotazioni")}>Annulla</button>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default ModificaPrenotazione;
