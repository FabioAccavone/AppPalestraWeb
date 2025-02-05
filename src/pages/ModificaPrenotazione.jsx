import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ModificaPrenotazione.css'

const ModificaPrenotazione = () => {
  const { idPrenotazione } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [allenamenti, setAllenamenti] = useState([]);
  const [selectedAllenamento, setSelectedAllenamento] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Carica gli allenamenti disponibili
  // Funzione per caricare gli allenamenti disponibili
   useEffect( () => {
    if (!selectedDate) {
      setAllenamenti([]); // Svuota la lista se la data viene rimossa 
      return;
    }

    axios.get(`http://localhost:5000/api/allenamenti/allenamentiDisponibili?data=${selectedDate}&idUtente=${user.id}`)
    .then(response => {
      if (response.data.message) {
        setAllenamenti([]);
        toast.info("Nessun allenamento disponibile per questa data."); // Mostra una notifica
      } else {
        setAllenamenti(response.data);
      }
    })
    .catch(error => console.error('Errore nel recupero degli allenamenti:', error));
  },[selectedDate]);

  // Funzione per confermare la modifica della prenotazione
  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/api/prenotazioni/modificaPrenotazione/${idPrenotazione}`, {
        idAllenamento: selectedAllenamento
      })
      .then(() => {
        navigate('/prenotazioni', { state: { message: 'Prenotazione aggiornata con successo!' } });
      })
      .catch(() => toast.error("Errore nella modifica della prenotazione."));
  };

  return (
    <div className="modifica-prenotazione-container">
      <NavBar />
      <h2>Modifica Prenotazione</h2>
      
      <div className="form-group">
      
      <div className="data-selezione">
        <label htmlFor="dataAllenamento" className="date-label">Seleziona una data:</label>
        <input
          type="date"
          id="dataAllenamento" 
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        </div>
        <label htmlFor="dataAllenamento" className="date-label">Seleziona una nuova Ora:</label>
        <select value={selectedAllenamento} onChange={(e) => setSelectedAllenamento(e.target.value)}>
          <option value="">-- Seleziona --</option>
          {allenamenti.map((allenamento) => (
            <option key={allenamento.idAllenamento} value={allenamento.idAllenamento}>
              {allenamento.oraInizio}
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
