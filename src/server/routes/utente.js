import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Recupera i dati dell'utente
router.get('/dati', (req, res) => {
  const { idUtente } = req.query;

  if (!idUtente) {
    return res.status(400).send('ID utente non fornito');
  }

  const query = `
    SELECT nome, cognome, datanascita, username, peso
    FROM utenti
    WHERE idUtente = ?
  `;

  db.query(query, [idUtente], (err, results) => {
    if (err) return res.status(500).send('Errore nel recupero dei dati utente');
    if (results.length === 0) return res.status(404).send('Utente non trovato');
    
    const utente = {
        ...results[0],
        datanascita: new Date(results[0].datanascita).toLocaleDateString('it-IT'),
      };

    res.json(utente);
  });
});

// Aggiorna i dati dell'utente
router.put('/aggiorna', (req, res) => {
  const { idUtente, newPeso, newPassword } = req.body;

  if (!idUtente || (!newPassword && !newPeso)) {
    return res.status(400).send('Dati incompleti');
  }

  const updateQuery = `
    UPDATE utenti
    SET password = ?, peso = ?
    WHERE idUtente = ?
  `;

  db.query(updateQuery, [newPassword, newPeso, idUtente], (err, results) => {
    if (err) return res.status(500).send('Errore nell\'aggiornamento dei dati');
    res.send('Dati aggiornati con successo');
  });
});

export default router;
