import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import PrenotazioneCard from '../components/PrenotazioneCard';
import './Prenotazioni.css'; // Importa il file CSS

const Prenotazioni = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Funzione per caricare le prenotazioni dell'utente
  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/api/prenotazioni/miePrenotazioni?idUtente=${user.id}`)
      .then(response => setPrenotazioni(response.data))
      .catch(error => console.error('Errore nel recupero delle prenotazioni:', error));
  }, [user]);

  // Funzione per cancellare una prenotazione
  const handleDelete = (idPrenotazione) => {
    axios
      .delete(`http://localhost:5000/api/prenotazioni/eliminaPrenotazione/${idPrenotazione}`)
      .then(() => {
        toast.success("Prenotazione cancellata con successo!");
        setPrenotazioni(prenotazioni.filter((p) => p.idPrenotazione !== idPrenotazione));
      })
      .catch(() => toast.error("Errore nella cancellazione della prenotazione."));
  };

  // Funzione per modificare una prenotazione (reindirizza a una pagina di modifica)
  const handleEdit = (idPrenotazione) => {
    navigate(`/modifica-prenotazione/${idPrenotazione}`);
  };
  
  return (
    <div className="richieste-container">
      <NavBar />
      <h2>Le tue richieste di prenotazione</h2>

      {prenotazioni.length === 0 ? (
        <p className="no-prenotazioni">Nessuna prenotazione trovata.</p>
      ) : (
        <div className="prenotazioni-list">
          {prenotazioni.map(prenotazione => (
           <PrenotazioneCard key={prenotazione.idPrenotazione} prenotazione={prenotazione} 
              handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Bottone per prenotare un nuovo allenamento */}
      <div className="button-container">
        <button className="btn-prenota-nuovo" onClick={() => navigate('/allenamenti')}>
          Prenota un nuovo allenamento
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Prenotazioni;
