import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GestioneUtenti = () => {
  const [utenti, setUtenti] = useState([]);
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [dataNascita, setdataNascita] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [peso, setPeso] = useState('');
  const [dataInizioAbb, setdataInizioAbb] = useState('');
  const [dataFineAbb, setdataFineAbb] = useState('');
  const [editingUser, setEditingUser] = useState(null); // Per sapere se stiamo modificando un utente

  // Funzione per recuperare gli utenti

  const fetchUtenti = () =>{

    const response = axios.get('http://localhost:5000/api/gestione-utente/utenti')
      .then(response =>setUtenti(response.data))
      .catch(error=>console.error("errore nel recupero delle richieste",error));
  }
  // Effettua il fetch degli utenti quando il componente viene caricato
  useEffect(() => {
        fetchUtenti();
  }, []);

  // Funzione per creare o modificare un utente
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = { nome, cognome, dataNascita, username, password, peso, dataInizioAbb, dataFineAbb };
  
    if (password) {  // Invia la password solo se è stata modificata
      userData.password = password;
    }
  
    try {
      if (editingUser) {
        axios.put(`http://localhost:5000/api/gestione-utente/modificaUtente/${editingUser}`, userData)
        .then(() => {
          toast.success("Utente modificato correttamente");
        }) // Mostra una notifica
        .catch(error => console.error('Errore nella modifica dell utente', error));
      } else {
        axios.post('http://localhost:5000/api/gestione-utente/creaUtente', userData)
        .then(() => {
          toast.success("Utente inserito correttamente");
        }) // Mostra una notifica
        .catch(error => console.error('Errore nella creazione dell utente:', error));;
      }
      fetchUtenti();
    } catch (error) {
      alert('Errore nella creazione o modifica dell\'utente');
    }
  };
  

  // Funzione per modificare un utente
  const handleEdit = (user) => {
    setNome(user.nome); // Attenzione alle maiuscole!
    setCognome(user.cognome);
    
    // Converti la data nel formato yyyy-mm-dd per il campo input date
    setdataNascita(user.dataNascita ? new Date(user.dataNascita).toISOString().split('T')[0] : '');
    setdataInizioAbb(user.dataInizioAbb ? new Date(user.dataInizioAbb).toISOString().split('T')[0] : '');
    setdataFineAbb(user.dataFineAbb ? new Date(user.dataFineAbb).toISOString().split('T')[0] : '');

    setUsername(user.username);
    setPeso(user.peso);
    setEditingUser(user.idUtente); // ✅ Assicurati di salvare l'ID
  };
  

  // Funzione per eliminare un utente
  const handleDelete = async (idUtente) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo utente?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/gestione-utente/eliminaUtente/${idUtente}`);
        alert('Utente eliminato con successo');
        fetchUtenti();
      } catch (error) {
        console.error('Errore nell\'eliminazione dell\'utente', error);
        alert('Si è verificato un errore');
      }
    }
  };

  return (
    <div>
      <NavBar/>
      <h2>Gestione Utenti</h2>

      {/* Form di creazione e modifica utente */}
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
          required={!editingUser} // Se stiamo modificando un utente, non richiediamo la password
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
        <button type="submit">{editingUser ? 'Aggiorna Utente' : 'Crea Utente'}</button>
      </form>

      {/* Tabella degli utenti */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>dataNascita</th>
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
                <td>{new Date(utente.dataNascita).toLocaleDateString('it-IT')}</td>
                <td>{utente.username}</td>
                <td>{utente.peso}</td>
                <td>{new Date(utente.dataInizioAbb).toLocaleDateString('it-IT')}</td>
                <td>{new Date(utente.dataFineAbb).toLocaleDateString('it-IT')}</td>
                <td>
                  <button onClick={() => handleEdit(utente)}>Modifica</button>
                  <button onClick={() => handleDelete(utente.idUtente)}>Elimina</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Nessun utente trovato</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GestioneUtenti;
