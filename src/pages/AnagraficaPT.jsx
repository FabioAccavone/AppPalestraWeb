import { useEffect, useState, useContext } from "react"; 
import axios from "axios"; 
import { AuthContext } from '../context/AuthContext'; 
import NavBar from "../components/NavBar"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import bcrypt from 'bcryptjs'; 
import '../style/Anagrafica.css'; 

// Componente funzionale per la pagina dell'anagrafica del Personal Trainer (PT)
const AnagraficaPT = () => {
  // Estrae l'oggetto "user" dal contesto di autenticazione, che contiene i dati dell'utente loggato
  const { user } = useContext(AuthContext);

  // Stato per memorizzare i dati dell'utente (PT) recuperati dal backend
  const [userData, setUserData] = useState(null);
  // Stato per memorizzare la nuova password inserita dall'utente
  const [newPassword, setNewPassword] = useState('');

  // useEffect per caricare i dati del PT non appena il componente viene montato o quando "user" cambia
  useEffect(() => {
    if (user) {
      // Effettua una richiesta GET per ottenere i dati del PT, usando l'id presente nel contesto
      axios.get(`http://localhost:5000/api/utente/datiPT?idPT=${user.id}`)
        .then(response => {
          // Se la richiesta ha successo, salva i dati nel relativo stato
          setUserData(response.data);
        })
        .catch(error => {
          // In caso di errore, mostra una notifica e logga l'errore nella console
          toast.error('Errore nel recupero dei dati del PT.');
          console.error(error);
        });
    }
  }, [user]); // Effettua l'effetto ogni volta che "user" cambia

  // Funzione per gestire l'aggiornamento della password
  const handleUpdate = () => {
    // Se il campo della nuova password è vuoto, mostra un messaggio di errore e interrompe la funzione
    if (!newPassword) {
      toast.error("Inserisci una nuova password per aggiornare.");
      return;
    }

    // Crittografa la nuova password in modo sincrono usando bcrypt (con 10 salt rounds)
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Effettua una richiesta PUT per aggiornare la password del PT nel backend
    axios.put('http://localhost:5000/api/utente/aggiornaPT', {
      idPT: user.id,           // Passa l'ID del PT dal contesto
      newPassword: hashedPassword, // Passa la password crittografata
    })
      .then(() => {
        // Se la richiesta ha successo, mostra una notifica di successo e pulisci il campo della password
        toast.success('Password aggiornata con successo!');
        setNewPassword('');
      })
      .catch(() => {
        // In caso di errore, mostra una notifica di errore
        toast.error('Errore nell\'aggiornamento della password.');
      });
  };

  // Se i dati dell'utente non sono ancora caricati, mostra un messaggio di caricamento
  if (!userData) return <div>Caricamento...</div>;

  return (
    <div className="anagrafica-container">
      {/* Barra di navigazione */}
      <NavBar />

      {/* Titolo della pagina */}
      <h2>Anagrafica Personal Trainer</h2>

      {/* Sezione che mostra i dettagli dell'utente (PT) */}
      <div className="user-details">
        <p><strong>Nome:</strong> {userData.nome}</p>
        <p><strong>Cognome:</strong> {userData.cognome}</p>
        <p><strong>Data di Assunzione:</strong> {userData.dataAssunzione}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Disponibilità:</strong> {userData.disponibilità}</p>
        <p>
          <strong>Nuova Password:</strong>
          {/* Input per la nuova password */}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nuova password"
          />
        </p>
      </div>

      {/* Bottone per aggiornare la password */}
      <button onClick={handleUpdate}>Aggiorna Password</button>

      {/* Contenitore per le notifiche toast */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AnagraficaPT;
