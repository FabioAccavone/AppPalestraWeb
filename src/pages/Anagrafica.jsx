import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from 'bcryptjs';
import './Anagrafica.css';

const Anagrafica = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPeso, setNewPeso] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      // Carica i dati dell'utente
    axios.get(`http://localhost:5000/api/utente/dati?idUtente=${user.id}`)
    .then(response => {
      setUserData(response.data);
    })
    .catch(error => {
      toast.error('Errore nel recupero dei dati utente.');
      console.error(error);
    });
    }
    
  }, [user]);

  const handleUpdate = () => {
    // Se la password è stata modificata, la criptografiamo
    let updatedData = {
      idUtente: user.id,
      newPeso: newPeso
    };

    if (newPassword) {
      // Crittografiamo la nuova password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);  // 10 è il numero di "salt rounds"
      updatedData = { ...updatedData, newPassword: hashedPassword };
    }


    axios.put('http://localhost:5000/api/utente/aggiorna', updatedData)
      .then(() => {
        toast.success('Dati aggiornati con successo!');
      })
      .catch(() => {
        toast.error('Errore nell\'aggiornamento dei dati.');
      });
  };

  if (!userData) return <div>Caricamento...</div>;

  return (
    <div className="anagrafica-container">
      <NavBar />
      <h2>Anagrafica Utente</h2>
      <div className="user-details">
        <p><strong>Nome:</strong> {userData.nome}</p>
        <p><strong>Cognome:</strong> {userData.cognome}</p>
        <p><strong>Data di Nascita:</strong> {userData.datanascita}</p>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Peso:</strong>
          <input
            type="number"
            value={newPeso || userData.peso}
            onChange={(e) => setNewPeso(e.target.value)}
          />
        </p>
        <p><strong>Password:</strong>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nuova password"
          />
        </p>
      </div>
      <button onClick={handleUpdate}>Aggiorna Dati</button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Anagrafica;
