import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const router = express.Router();

// Ottiene l'elenco di tutti gli utenti
// Restituisce una lista di tutti gli utenti nel database.
router.get('/utenti', (req, res) => {
  const query = 'SELECT idUtente,Nome,Cognome,dataNascita,username,password,peso,dataInizioAbb,dataFineAbb FROM utenti';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nel recupero degli utenti:", err);
      return res.status(500).json({ error: "Errore nel recupero degli utenti" });
    }
    res.json(results); // Risultato della query restituito come JSON
  });
});

// Crea un nuovo utente
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
      return res.status(400).json({ error: "Username già in uso" }); // Se l'username è già presente, ritorna un errore
    }

    // Cifra la password usando bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Errore nella cifratura della password:", err);
        return res.status(500).json({ error: "Errore nella cifratura della password" });
      }

      // Inserisce il nuovo utente nel database
      const query = 'INSERT INTO utenti (nome, cognome, dataNascita,username, password, peso, dataInizioAbb, dataFineAbb) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [nome, cognome ,dataNascita, username, hashedPassword, peso, dataInizioAbb, dataFineAbb], (err, result) => {
        if (err) {
          console.error("Errore nell'inserimento dell'utente:", err);
          return res.status(500).json({ error: "Errore nell'inserimento dell'utente" });
        }

        res.status(201).json({ message: 'Utente creato con successo', idUtente: result.insertId }); // Restituisce il successivo id dell'utente creato
      });
    });
  });
});

// Modifica un utente esistente
// Le informazioni da modificare sono fornite nel corpo della richiesta.
router.put('/modificaUtente/:idUtente', (req, res) => {
  const { idUtente } = req.params;
  const { nome, cognome, dataNascita, username, peso, dataInizioAbb, dataFineAbb } = req.body;

  // Query per aggiornare le informazioni dell'utente nel database
  const query = 'UPDATE utenti SET nome = ?, cognome = ?,dataNascita=?, username = ?, peso = ?, dataInizioAbb = ?, dataFineAbb = ? WHERE idUtente = ?';
  db.query(query, [nome, cognome, dataNascita, username, peso, dataInizioAbb, dataFineAbb, idUtente], (err) => {
    if (err) {
      console.error("Errore nell'aggiornamento dell'utente:", err);
      return res.status(500).json({ error: "Errore nell'aggiornamento dell'utente" });
    }

    res.json({ message: 'Utente aggiornato con successo' }); // Ritorna un messaggio di successo
  });
});

//Elimina un utente dato l'id
router.delete('/eliminaUtente/:idUtente', (req, res) => {
  const { idUtente } = req.params;

  // Query per eliminare l'utente dal database
  const query = 'DELETE FROM utenti WHERE idUtente = ?';
  db.query(query, [idUtente], (err) => {
    if (err) {
      console.error("Errore nell'eliminazione dell'utente:", err);
      return res.status(500).json({ error: "Errore nell'eliminazione dell'utente" });
    }

    res.json({ message: 'Utente eliminato con successo' }); // Ritorna un messaggio di successo
  });
});

// Restituisce tutti i personal trainers presenti nel database.
router.get('/trainers', (req, res) => {
  const query = 'SELECT * FROM pt';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Errore nel recupero dei PT" });
    res.json(results); // Restituisce tutti i PT come JSON
  });
});

// Permette di creare un nuovo PT nel sistema. La password è cifrata prima di essere salvata nel database.
router.post('/creaTrainer', (req, res) => {
  const { nome, cognome, dataAssunzione, username, disponibilita, password  } = req.body;

  // Cifra la password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Errore nella cifratura della password" });

    // Query per inserire un nuovo PT nel database
    const query = 'INSERT INTO pt (Nome, Cognome, dataAssunzione, username, password, disponibilità) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, cognome, dataAssunzione, username, hashedPassword, disponibilita], (err) => {
      if (err) return res.status(500).json({ error: "Errore nella creazione del PT" });
      res.status(201).json({ message: 'PT creato con successo' }); // Restituisce un messaggio di successo
    });
  });
});

// Permette di modificare le informazioni di un PT esistente.
router.put('/modificaTrainer/:idPT', (req, res) => {
  const { idPT } = req.params;
  const { nome, cognome, dataAssunzione, username, disponibilita } = req.body;

  // Query per aggiornare i dettagli di un PT
  const query = 'UPDATE pt SET Nome=?, Cognome=?, dataAssunzione=?, username=?, disponibilità=? WHERE idPT=?';
  db.query(query, [nome, cognome, dataAssunzione, username, disponibilita, idPT], (err) => {
    if (err) return res.status(500).json({ error: "Errore nell'aggiornamento del PT" });
    res.json({ message: 'PT aggiornato con successo' }); // Ritorna un messaggio di successo
  });
});

// Elimina un PT dato il suo id.
router.delete('/eliminaTrainer/:idPT', (req, res) => {
  const { idPT } = req.params;

  // Query per eliminare un PT dal database
  db.query('DELETE FROM pt WHERE idPT=?', [idPT], (err) => {
    if (err) return res.status(500).json({ error: "Errore nell'eliminazione del PT" });
    res.json({ message: 'PT eliminato con successo' }); // Ritorna un messaggio di successo
  });
});

export default router;
