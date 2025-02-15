import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Recupera i dati dell'utente
router.get('/datiUtente', (req, res) => {
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
router.put('/aggiornaUtente', (req, res) => {
  const { idUtente, newPeso, newPassword } = req.body;

  if (!idUtente || (!newPassword && !newPeso)) {
    return res.status(400).send('Dati incompleti');
  }

  const updateQuery = `
    UPDATE utenti
    SET password = ?, peso = ?
    WHERE idUtente = ?
  `;

  db.query(updateQuery, [newPassword, newPeso, idUtente], (err) => {
    if (err) return res.status(500).send('Errore nell\'aggiornamento dei dati');
    res.send('Dati aggiornati con successo');
  });
});

// Recupera i dati del PT
router.get('/datiPT', (req, res) => {
  const { idPT } = req.query;

  if (!idPT) {
    return res.status(400).send('ID PT non fornito');
  }

  const query = `
    SELECT nome, cognome, dataAssunzione, username, disponibilità
    FROM pt
    WHERE idPT = ?
  `;

  db.query(query, [idPT], (err, results) => {
    if (err) return res.status(500).send('Errore nel recupero dei dati del PT');
    if (results.length === 0) return res.status(404).send('PT non trovato');
    
    const pt = {
      ...results[0],
      dataAssunzione: new Date(results[0].dataAssunzione).toLocaleDateString('it-IT'),
    };

    res.json(pt);
  });
});

// Aggiorna la password del PT
router.put('/aggiornaPT', (req, res) => {
  const { idPT, newPassword } = req.body;

  if (!idPT || !newPassword) {
    return res.status(400).send('Dati incompleti');
  }

  const updateQuery = `
    UPDATE pt
    SET password = ?
    WHERE idPT = ?
  `;

  db.query(updateQuery, [newPassword, idPT], (err) => {
    if (err) return res.status(500).send('Errore nell\'aggiornamento della password');
    res.send('Password aggiornata con successo');
  });
});

export default router;
