import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import NavBar from "../components/NavBar"; 

const GestionePT = () => {
  // Definizione degli stati per la gestione dei Personal Trainer (PT)
  const [trainers, setTrainers] = useState([]); // Stato per memorizzare la lista dei PT
  const [nome, setNome] = useState(''); // Stato per il nome del PT
  const [cognome, setCognome] = useState(''); // Stato per il cognome del PT
  const [dataAssunzione, setDataAssunzione] = useState(''); // Stato per la data di assunzione del PT
  const [username, setUsername] = useState(''); // Stato per lo username del PT
  const [password, setPassword] = useState(''); // Stato per la password del PT
  const [disponibilita, setDisponibilita] = useState(''); // Stato per la disponibilità (mattina/pomeriggio)
  const [editingTrainer, setEditingTrainer] = useState(null); // Stato per identificare se stiamo modificando un PT esistente

  // Funzione per recuperare la lista dei PT dal server
  const fetchTrainers = () => {
    axios.get('http://localhost:5000/api/gestione-utente/trainers') // Fai una richiesta GET all'API per ottenere i PT
      .then(response => setTrainers(response.data)) // Imposta la lista dei PT nello stato
      .catch(error => console.error("Errore nel recupero dei PT", error)); // Gestione degli errori nella richiesta
  };

  // Effetto per caricare i PT quando il componente viene montato
  useEffect(() => {
    fetchTrainers(); // Carica i PT alla prima renderizzazione del componente
  }, []); // L'effetto viene eseguito solo una volta, quando il componente è montato

  // Funzione per gestire l'invio del modulo (creazione o modifica di un PT)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita il comportamento di default del form (ricaricamento della pagina)
    
    // Crea un oggetto con i dati del PT da inviare al server
    const trainerData = { nome, cognome, dataAssunzione, username, disponibilita };
    
    // Aggiungi la password solo se è stata modificata
    if (password) {
      trainerData.password = password;
    }

    try {
      // Se stiamo modificando un PT esistente, fai una richiesta PUT, altrimenti una POST per crearne uno nuovo
      if (editingTrainer) {
        await axios.put(`http://localhost:5000/api/gestione-utente/modificaTrainer/${editingTrainer}`, trainerData);
        toast.success("PT aggiornato con successo"); // Mostra una notifica di successo
      } else {
        await axios.post('http://localhost:5000/api/gestione-utente/creaTrainer', trainerData);
        toast.success("PT creato con successo"); // Mostra una notifica di successo
      }
      fetchTrainers(); // Ricarica la lista dei PT
    } catch (error) {
      console.error('Errore nella gestione del PT:', error); // Gestione dell'errore
      toast.error("Errore durante l'operazione"); // Mostra una notifica di errore
    }
  };

  // Funzione per gestire la modifica di un PT
  const handleEdit = (trainer) => {
    // Imposta i campi del form con i dati del PT selezionato per la modifica
    setNome(trainer.nome || '');
    setCognome(trainer.cognome || '');
    setDataAssunzione(trainer.dataAssunzione ? new Date(trainer.dataAssunzione).toISOString().split('T')[0] : '');
    setUsername(trainer.username || '');
    setDisponibilita(trainer.disponibilita || '');
    setEditingTrainer(trainer.idPT); // Imposta l'ID del PT che stiamo modificando
  };

  // Funzione per gestire l'eliminazione di un PT
  const handleDelete = async (idPT) => {
    // Conferma l'eliminazione tramite una finestra di conferma
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo PT?');
    if (confirmDelete) {
      try {
        // Fai una richiesta DELETE per eliminare il PT dal server
        await axios.delete(`http://localhost:5000/api/gestione-utente/eliminaTrainer/${idPT}`);
        toast.success("PT eliminato con successo"); // Mostra una notifica di successo
        fetchTrainers(); // Ricarica la lista dei PT
      } catch (error) {
        console.error('Errore nell\'eliminazione del PT', error); // Gestione dell'errore
        toast.error("Errore durante l'eliminazione"); // Mostra una notifica di errore
      }
    }
  };

  return (
    <div>
      {/* Barra di navigazione */}
      <NavBar />
      <h2>Gestione Personal Trainer</h2>

      {/* Form per creare o modificare un PT */}
      <form onSubmit={handleSubmit}>
        {/* Campi di input per il nome, cognome, data di assunzione, username, password e disponibilità */}
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
        <input type="date" placeholder="Data Assunzione" value={dataAssunzione} onChange={(e) => setDataAssunzione(e.target.value)} required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required={!editingTrainer} />
        
        {/* Select per la disponibilità (mattina o pomeriggio) */}
        <select value={disponibilita} onChange={(e) => setDisponibilita(e.target.value)} required>
          <option value="">Seleziona disponibilità</option>
          <option value="mattina">Mattina</option>
          <option value="pomeriggio">Pomeriggio</option>
        </select>
        
        {/* Bottone per inviare il modulo (creazione o aggiornamento) */}
        <button type="submit">{editingTrainer ? 'Aggiorna PT' : 'Crea PT'}</button>
      </form>

      {/* Tabella che mostra i PT esistenti */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Data Assunzione</th>
            <th>Username</th>
            <th>Disponibilità</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {trainers.length > 0 ? (
            trainers.map((trainer) => (
              <tr key={trainer.idPT}>
                <td>{trainer.Nome}</td>
                <td>{trainer.Cognome}</td>
                <td>{new Date(trainer.dataAssunzione).toLocaleDateString('it-IT')}</td>
                <td>{trainer.username}</td>
                <td>{trainer.disponibilità}</td>
                <td>
                  <button onClick={() => handleEdit(trainer)}>Modifica</button>
                  <button onClick={() => handleDelete(trainer.idPT)}>Elimina</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nessun PT trovato</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Contenitore per le notifiche */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default GestionePT;
