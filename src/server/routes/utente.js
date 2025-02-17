import express from 'express';
import db from '../config/db.js';

// Crea un router Express per gestire le rotte relative ai dati degli utenti e dei personal trainer (PT)
const router = express.Router();


// =========================================================
// Recupera i dati dell'utente
// =========================================================
router.get('/datiUtente', (req, res) => {
  // Estrae l'ID dell'utente dalla query string
  const { idUtente } = req.query;

  // Se idUtente non viene fornito, restituisce un errore 400
  if (!idUtente) {
    return res.status(400).send('ID utente non fornito');
  }

  // Query SQL per selezionare nome, cognome, datanascita, username e peso dell'utente
  const query = `
    SELECT nome, cognome, datanascita, username, peso
    FROM utenti
    WHERE idUtente = ?
  `;

  // Esegue la query sostituendo il placeholder con idUtente
  db.query(query, [idUtente], (err, results) => {
    // Se si verifica un errore nel database, restituisce errore 500
    if (err) return res.status(500).send('Errore nel recupero dei dati utente');
    // Se non viene trovato nessun utente, restituisce errore 404
    if (results.length === 0) return res.status(404).send('Utente non trovato');

    // Formattta la data di nascita in formato italiano (GG/MM/AAAA)
    const utente = {
      ...results[0],
      datanascita: new Date(results[0].datanascita).toLocaleDateString('it-IT'),
    };

    // Restituisce i dati dell'utente in formato JSON
    res.json(utente);
  });
});


// =========================================================
// Aggiorna i dati dell'utente
// =========================================================
router.put('/aggiornaUtente', (req, res) => {
  // Estrae idUtente, newPeso e newPassword dal corpo della richiesta
  const { idUtente, newPeso, newPassword } = req.body;

  // Verifica che idUtente sia fornito e che almeno uno dei dati (newPassword o newPeso) sia presente
  if (!idUtente || (!newPassword && !newPeso)) {
    return res.status(400).send('Dati incompleti');
  }

  // Query SQL per aggiornare la password e il peso dell'utente
  const updateQuery = `
    UPDATE utenti
    SET password = ?, peso = ?
    WHERE idUtente = ?
  `;

  // Esegue la query sostituendo i placeholder con newPassword, newPeso e idUtente
  db.query(updateQuery, [newPassword, newPeso, idUtente], (err) => {
    // Se si verifica un errore nell'aggiornamento, restituisce errore 500
    if (err) return res.status(500).send('Errore nell\'aggiornamento dei dati');
    // In caso di successo, invia un messaggio di conferma
    res.send('Dati aggiornati con successo');
  });
});


// =========================================================
// Recupera i dati del PT
// =========================================================
router.get('/datiPT', (req, res) => {
  // Estrae l'ID del PT dalla query string
  const { idPT } = req.query;

  // Se idPT non viene fornito, restituisce errore 400
  if (!idPT) {
    return res.status(400).send('ID PT non fornito');
  }

  // Query SQL per selezionare nome, cognome, dataAssunzione, username e disponibilità del PT
  const query = `
    SELECT nome, cognome, dataAssunzione, username, disponibilità
    FROM pt
    WHERE idPT = ?
  `;

  // Esegue la query sostituendo il placeholder con idPT
  db.query(query, [idPT], (err, results) => {
    // Se si verifica un errore, restituisce errore 500
    if (err) return res.status(500).send('Errore nel recupero dei dati del PT');
    // Se non viene trovato nessun PT, restituisce errore 404
    if (results.length === 0) return res.status(404).send('PT non trovato');

    // Formattta la data di assunzione in formato italiano (GG/MM/AAAA)
    const pt = {
      ...results[0],
      dataAssunzione: new Date(results[0].dataAssunzione).toLocaleDateString('it-IT'),
    };

    // Restituisce i dati del PT in formato JSON
    res.json(pt);
  });
});


// =========================================================
// Aggiorna la password del PT
// =========================================================
router.put('/aggiornaPT', (req, res) => {
  // Estrae idPT e newPassword dal corpo della richiesta
  const { idPT, newPassword } = req.body;

  // Verifica che entrambi i dati siano forniti, altrimenti restituisce errore 400
  if (!idPT || !newPassword) {
    return res.status(400).send('Dati incompleti');
  }

  // Query SQL per aggiornare la password del PT
  const updateQuery = `
    UPDATE pt
    SET password = ?
    WHERE idPT = ?
  `;

  // Esegue la query sostituendo i placeholder con newPassword e idPT
  db.query(updateQuery, [newPassword, idPT], (err) => {
    // Se si verifica un errore, restituisce errore 500
    if (err) return res.status(500).send('Errore nell\'aggiornamento della password');
    // In caso di successo, invia un messaggio di conferma
    res.send('Password aggiornata con successo');
  });
});

// Esporta il router per essere utilizzato nel file principale dell'applicazione
export default router;
