import { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { AuthContext } from '../context/AuthContext'; 
import NavBar from "../components/NavBar"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from 'bcryptjs';


const AnagraficaUtente = () => {
  const { user } = useContext(AuthContext); // Ottiene i dati dell'utente autenticato dal contesto
  const [userData, setUserData] = useState(null); // Stato per memorizzare i dati dell'utente
  const [newPassword, setNewPassword] = useState(''); // Stato per la nuova password
  const [newPeso, setNewPeso] = useState(''); // Stato per il nuovo peso

  useEffect(() => {
    // Quando l'utente è autenticato, carica i dati dell'utente
    if(user){
      // Effettua una richiesta GET al server per ottenere i dati dell'utente
      axios.get(`http://localhost:5000/api/utente/datiUtente?idUtente=${user.id}`)
      .then(response => {
        setUserData(response.data); // Memorizza i dati dell'utente nello stato
      })
      .catch(error => {
        // Se c'è un errore, mostra una notifica di errore
        toast.error('Errore nel recupero dei dati utente.');
        console.error(error);
      });
    }
  }, [user]); // Ricarica i dati ogni volta che l'utente cambia

  const handleUpdate = () => {
    // Prepara i dati da inviare per l'aggiornamento
    let updatedData = {
      idUtente: user.id,
      newPeso: newPeso // Aggiunge il nuovo peso
    };

    if (newPassword) {
      // Se la password è stata cambiata, la cifra prima di inviarla
      const hashedPassword = bcrypt.hashSync(newPassword, 10);  // 10 è il numero di "salt rounds"
      updatedData = { ...updatedData, newPassword: hashedPassword }; // Aggiunge la nuova password cifrata
    }

    // Effettua una richiesta PUT per aggiornare i dati dell'utente
    axios.put('http://localhost:5000/api/utente/aggiornaUtente', updatedData)
      .then(() => {
        // Mostra una notifica di successo se i dati sono stati aggiornati correttamente
        toast.success('Dati aggiornati con successo!');
      })
      .catch(() => {
        // Mostra una notifica di errore in caso di problemi
        toast.error('Errore nell\'aggiornamento dei dati.');
      });
  };

  // Se i dati dell'utente non sono ancora stati caricati, mostra un messaggio di caricamento
  if (!userData) return <div>Caricamento...</div>;

  return (
    <div className="anagrafica-container">
      <NavBar /> {/* Barra di navigazione */}
      <h2>Anagrafica Utente</h2> {/* Titolo della pagina */}
      <div className="user-details">
        {/* Mostra i dettagli dell'utente */}
        <p><strong>Nome:</strong> {userData.nome}</p>
        <p><strong>Cognome:</strong> {userData.cognome}</p>
        <p><strong>Data di Nascita:</strong> {userData.datanascita}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Peso:</strong>
          {/* Input per aggiornare il peso dell'utente */}
          <input
            type="number"
            value={newPeso || userData.peso} // Se l'utente ha già inserito un nuovo peso, usa quello, altrimenti usa il peso attuale
            onChange={(e) => setNewPeso(e.target.value)} // Aggiorna lo stato quando cambia il valore dell'input
          />
        </p>
        <p><strong>Password:</strong>
          {/* Input per inserire una nuova password */}
          <input
            type="password"
            value={newPassword} // Valore della nuova password
            onChange={(e) => setNewPassword(e.target.value)} // Aggiorna lo stato quando cambia il valore dell'input
            placeholder="Nuova password" // Testo di suggerimento
          />
        </p>
      </div>
      {/* Bottone per aggiornare i dati */}
      <button onClick={handleUpdate}>Aggiorna Dati</button>
      {/* Container per le notifiche toast */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AnagraficaUtente; 