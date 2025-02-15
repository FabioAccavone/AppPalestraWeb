import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from 'bcryptjs';
import '../style/Anagrafica.css';

const AnagraficaPT = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      // Carica i dati del PT
      axios.get(`http://localhost:5000/api/utente/datiPT?idPT=${user.id}`)
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          toast.error('Errore nel recupero dei dati del PT.');
          console.error(error);
        });
    }
  }, [user]);

  const handleUpdate = () => {
    if (!newPassword) {
      toast.error("Inserisci una nuova password per aggiornare.");
      return;
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);  // Crittografia password

    axios.put('http://localhost:5000/api/utente/aggiornaPT', {
      idPT: user.id,
      newPassword: hashedPassword,
    })
      .then(() => {
        toast.success('Password aggiornata con successo!');
        setNewPassword('');
      })
      .catch(() => {
        toast.error('Errore nell\'aggiornamento della password.');
      });
  };

  if (!userData) return <div>Caricamento...</div>;

  return (
    <div className="anagrafica-container">
      <NavBar />
      <h2>Anagrafica Personal Trainer</h2>
      <div className="user-details">
        <p><strong>Nome:</strong> {userData.nome}</p>
        <p><strong>Cognome:</strong> {userData.cognome}</p>
        <p><strong>Data di Assunzione:</strong> {userData.dataAssunzione}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Disponibilità:</strong> {userData.disponibilità}</p>
        <p><strong>Nuova Password:</strong>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nuova password"
          />
        </p>
      </div>
      <button onClick={handleUpdate}>Aggiorna Password</button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AnagraficaPT;
