import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const router = express.Router();

// 📌 Ottieni l'elenco di tutti gli utenti
router.get('/utenti', (req, res) => {
  const query = 'SELECT idUtente,Nome,Cognome,dataNascita,username,password,peso,dataInizioAbb,dataFineAbb FROM utenti';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nel recupero degli utenti:", err);
      return res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
    res.json(results); // Risultato della query dovrebbe essere un array
  });
});


// 📌 Crea un nuovo utente
router.post('/creaUtente', (req, res) => {
  const { nome, cognome, dataNascita, username, password, peso, dataInizioAbb, dataFineAbb } = req.body;

  // Verifica se l'username è già in uso
  const checkQuery = 'SELECT * FROM utenti WHERE username = ?';
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error("Errore nel controllo dell'username:", err);
      return res.status(500).json({ error: "Errore nel controllo dell'username" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Username già in uso" });
    }

    // Cifra la password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Errore nella cifratura della password:", err);
        return res.status(500).json({ error: "Errore nella cifratura della password" });
      }

      // Inserisci l'utente nel database
      const query = 'INSERT INTO utenti (nome, cognome, dataNascita,username, password, peso, dataInizioAbb, dataFineAbb) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [nome, cognome ,dataNascita, username, hashedPassword, peso, dataInizioAbb, dataFineAbb], (err, result) => {
        if (err) {
          console.error("Errore nell'inserimento dell'utente:", err);
          return res.status(500).json({ error: "Errore nell'inserimento dell'utente" });
        }

        res.status(201).json({ message: 'Utente creato con successo', idUtente: result.insertId });
      });
    });
  });
});

// 📌 Modifica un utente esistente
router.put('/modificaUtente/:idUtente', (req, res) => {
  const { idUtente } = req.params;
  const { nome, cognome, dataNascita, username, peso, dataInizioAbb, dataFineAbb } = req.body;

  const query = 'UPDATE utenti SET nome = ?, cognome = ?,dataNascita=?, username = ?, peso = ?, dataInizioAbb = ?, dataFineAbb = ? WHERE idUtente = ?';
  db.query(query, [nome, cognome, dataNascita, username, peso, dataInizioAbb, dataFineAbb, idUtente], (err) => {
    if (err) {
      console.error("Errore nell'aggiornamento dell'utente:", err);
      return res.status(500).json({ error: "Errore nell'aggiornamento dell'utente" });
    }

    res.json({ message: 'Utente aggiornato con successo' });
  });
});

// 📌 Elimina un utente
router.delete('/eliminaUtente/:idUtente', (req, res) => {
  const { idUtente } = req.params;

  const query = 'DELETE FROM utenti WHERE idUtente = ?';
  db.query(query, [idUtente], (err) => {
    if (err) {
      console.error("Errore nell'eliminazione dell'utente:", err);
      return res.status(500).json({ error: "Errore nell'eliminazione dell'utente" });
    }

    res.json({ message: 'Utente eliminato con successo' });
  });
});

// Ottieni tutti i PT
router.get('/trainers', (req, res) => {
  const query = 'SELECT * FROM pt';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Errore nel recupero dei PT" });
    res.json(results);
  });
});

// Crea un nuovo PT
router.post('/creaTrainer', (req, res) => {
  const { nome, cognome, dataAssunzione, username, disponibilita, password  } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Errore nella cifratura della password" });

    const query = 'INSERT INTO pt (Nome, Cognome, dataAssunzione, username, password, disponibilità) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, cognome, dataAssunzione, username, hashedPassword, disponibilita], (err) => {
      if (err) return res.status(500).json({ error: "Errore nella creazione del PT" });
      res.status(201).json({ message: 'PT creato con successo' });
    });
  });
});

// Modifica un PT
router.put('/modificaTrainer/:idPT', (req, res) => {
  const { idPT } = req.params;
  const { nome, cognome, dataAssunzione, username, disponibilita } = req.body;

  const query = 'UPDATE pt SET Nome=?, Cognome=?, dataAssunzione=?, username=?, disponibilità=? WHERE idPT=?';
  db.query(query, [nome, cognome, dataAssunzione, username, disponibilita, idPT], (err) => {
    if (err) return res.status(500).json({ error: "Errore nell'aggiornamento del PT" });
    res.json({ message: 'PT aggiornato con successo' });
  });
});

// Elimina un PT
router.delete('/eliminaTrainer/:idPT', (req, res) => {
  const { idPT } = req.params;

  db.query('DELETE FROM pt WHERE idPT=?', [idPT], (err) => {
    if (err) return res.status(500).json({ error: "Errore nell'eliminazione del PT" });
    res.json({ message: 'PT eliminato con successo' });
  });
});

export default router;
