import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";

const GestionePT = () => {
  const [trainers, setTrainers] = useState([]);
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [dataAssunzione, setDataAssunzione] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disponibilita, setDisponibilita] = useState('');
  const [editingTrainer, setEditingTrainer] = useState(null);

  const fetchTrainers = () => {
    axios.get('http://localhost:5000/api/gestione-utente/trainers')
      .then(response => setTrainers(response.data))
      .catch(error => console.error("Errore nel recupero dei PT", error));
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trainerData = { nome, cognome, dataAssunzione, username, disponibilita };
    
    if (password) {
      trainerData.password = password; // Invia la password solo se è stata modificata
    }

    try {
      if (editingTrainer) {
        await axios.put(`http://localhost:5000/api/gestione-utente/modificaTrainer/${editingTrainer}`, trainerData);
        toast.success("PT aggiornato con successo");
      } else {
        await axios.post('http://localhost:5000/api/gestione-utente/creaTrainer', trainerData);
        toast.success("PT creato con successo");
      }
      fetchTrainers();
    } catch (error) {
      console.error('Errore nella gestione del PT:', error);
      toast.error("Errore durante l'operazione");
    }
  };

  const handleEdit = (trainer) => {
    setNome(trainer.nome || '');
    setCognome(trainer.cognome || '');
    setDataAssunzione(trainer.dataAssunzione ? new Date(trainer.dataAssunzione).toISOString().split('T')[0] : '');
    setUsername(trainer.username || '');
    setDisponibilita(trainer.disponibilita || '');
    setEditingTrainer(trainer.idPT);
  };

  const handleDelete = async (idPT) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo PT?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/gestione-utente/eliminaTrainer/${idPT}`);
        toast.success("PT eliminato con successo");
        fetchTrainers();
      } catch (error) {
        console.error('Errore nell\'eliminazione del PT', error);
        toast.error("Errore durante l'eliminazione");
      }
    }
  };

  return (
    <div>
      <NavBar />
      <h2>Gestione Personal Trainer</h2>

      {/* Form per creare/modificare PT */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
        <input type="date" placeholder="Data Assunzione" value={dataAssunzione} onChange={(e) => setDataAssunzione(e.target.value)} required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required={!editingTrainer} />
        {/* Select per Disponibilità */}
        <select value={disponibilita} onChange={(e) => setDisponibilita(e.target.value)} required>
          <option value="">Seleziona disponibilità</option>
          <option value="mattina">Mattina</option>
          <option value="pomeriggio">Pomeriggio</option>
        </select>
        <button type="submit">{editingTrainer ? 'Aggiorna PT' : 'Crea PT'}</button>
      </form>

      {/* Tabella PT */}
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default GestionePT;
