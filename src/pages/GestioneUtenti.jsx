import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from '../context/AuthContext'; 
import NavBar from "../components/NavBar"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const GestioneUtenti = () => {
  // Stato per memorizzare gli utenti, i dati del form e l'utente che si sta modificando
  const [utenti, setUtenti] = useState([]);
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [dataNascita, setdataNascita] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [peso, setPeso] = useState('');
  const [dataInizioAbb, setdataInizioAbb] = useState('');
  const [dataFineAbb, setdataFineAbb] = useState('');
  const [editingUser, setEditingUser] = useState(null); // Stato per sapere se stiamo modificando un utente

  // Funzione per recuperare gli utenti dal server
  const fetchUtenti = () => {
    const response = axios.get('http://localhost:5000/api/gestione-utente/utenti')
      .then(response => setUtenti(response.data)) // Imposta lo stato degli utenti
      .catch(error => console.error("errore nel recupero delle richieste", error)); // Gestisce gli errori
  };

  // Effettua il fetch degli utenti quando il componente viene caricato
  useEffect(() => {
    fetchUtenti();
  }, []);

  // Funzione per creare o modificare un utente
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenzione del comportamento predefinito del form
  
    // Crea l'oggetto con i dati dell'utente
    const userData = { nome, cognome, dataNascita, username, password, peso, dataInizioAbb, dataFineAbb };

    // Se la password è stata modificata, la invia
    if (password) {
      userData.password = password;
    }

    try {
      // Se stiamo modificando un utente esistente
      if (editingUser) {
        axios.put(`http://localhost:5000/api/gestione-utente/modificaUtente/${editingUser}`, userData)
          .then(() => {
            toast.success("Utente modificato correttamente"); // Notifica di successo
            fetchUtenti(); // Ricarica la lista degli utenti
          })
          .catch(error => console.error('Errore nella modifica dell utente', error));
      } else {
        // Se stiamo creando un nuovo utente
        axios.post('http://localhost:5000/api/gestione-utente/creaUtente', userData)
          .then(() => {
            toast.success("Utente inserito correttamente"); // Notifica di successo
            fetchUtenti(); // Ricarica la lista degli utenti
          })
          .catch(error => console.error('Errore nella creazione dell utente:', error));
      }
    } catch (error) {
      alert('Errore nella creazione o modifica dell\'utente'); // Gestisce errori generali
    }
  };

  // Funzione per modificare un utente
  const handleEdit = (user) => {
    setNome(user.nome || ''); // Imposta il nome con fallback se il valore è vuoto
    setCognome(user.cognome || '');
    setdataNascita(user.dataNascita ? new Date(user.dataNascita).toISOString().split('T')[0] : ''); // Converte la data in formato ISO
    setdataInizioAbb(user.dataInizioAbb ? new Date(user.dataInizioAbb).toISOString().split('T')[0] : '');
    setdataFineAbb(user.dataFineAbb ? new Date(user.dataFineAbb).toISOString().split('T')[0] : '');
    setUsername(user.username || '');
    setPeso(user.peso || 0);
    setEditingUser(user.idUtente); // Imposta l'utente che si sta modificando
  };

  // Funzione per eliminare un utente
  const handleDelete = async (idUtente) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo utente?'); // Conferma dell'eliminazione
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/gestione-utente/eliminaUtente/${idUtente}`); // Elimina l'utente dal server
        alert('Utente eliminato con successo');
        fetchUtenti(); // Ricarica la lista degli utenti
      } catch (error) {
        console.error('Errore nell\'eliminazione dell\'utente', error); // Gestisce gli errori
        alert('Si è verificato un errore');
      }
    }
  };

  return (
    <div>
      <NavBar /> {/* Barra di navigazione */}
      <h2>Gestione Utenti</h2>

      {/* Form per creare e modificare un utente */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="dataNascita"
          value={dataNascita}
          onChange={(e) => setdataNascita(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!editingUser} // La password è obbligatoria solo se stiamo creando un nuovo utente
        />
        <input
          type="number"
          placeholder="Peso"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          required
        />
        <input
          type="date"
          value={dataInizioAbb}
          onChange={(e) => setdataInizioAbb(e.target.value)}
          required
        />
        <input
          type="date"
          value={dataFineAbb}
          onChange={(e) => setdataFineAbb(e.target.value)}
          required
        />
        <button type="submit">{editingUser ? 'Aggiorna Utente' : 'Crea Utente'}</button> {/* Cambia il testo del bottone in base alla modifica o creazione */}
      </form>

      {/* Tabella degli utenti */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Data di Nascita</th>
            <th>Username</th>
            <th>Peso</th>
            <th>Data Inizio Abbonamento</th>
            <th>Data Fine Abbonamento</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(utenti) && utenti.length > 0 ? (
            utenti.map((utente) => (
              <tr key={utente.idUtente}>
                <td>{utente.Nome}</td>
                <td>{utente.Cognome}</td>
                <td>{new Date(utente.dataNascita).toLocaleDateString('it-IT')}</td> {/* Formattazione della data */}
                <td>{utente.username}</td>
                <td>{utente.peso}</td>
                <td>{new Date(utente.dataInizioAbb).toLocaleDateString('it-IT')}</td> {/* Formattazione della data */}
                <td>{new Date(utente.dataFineAbb).toLocaleDateString('it-IT')}</td> {/* Formattazione della data */}
                <td>
                  <button onClick={() => handleEdit(utente)}>Modifica</button> {/* Modifica utente */}
                  <button onClick={() => handleDelete(utente.idUtente)}>Elimina</button> {/* Elimina utente */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Nessun utente trovato</td> {/* Messaggio se non ci sono utenti */}
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> {/* Container per le notifiche */}
    </div>
  );
};

export default GestioneUtenti;
