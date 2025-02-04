import express from 'express';
import db from '../config/db.js';

const router = express.Router();

//Inserimento di una nuova Prenotazione e modifica del Numero di Posti dell'allenamento
router.post('/prenotaAllenamento', (req, res) => {
  const { idUtente, idAllenamento } = req.body;

  const prenotazioneQuery = 'INSERT INTO prenotazioni (dataPrenotazione, idUtente, idAllenamento) VALUES (CURDATE(), ?, ?)';
  const updateQuery = 'UPDATE allenamenti SET numPosti = numPosti - 1 WHERE idAllenamento = ? AND numPosti > 0';

  db.query(prenotazioneQuery, [idUtente, idAllenamento], (err) => {
    if (err) return res.status(500).send('Errore nella prenotazione');

    db.query(updateQuery, [idAllenamento], (err, result) => {
      if (err) return res.status(500).send('Errore nell’aggiornamento');
      if (result.affectedRows === 0) return res.status(400).send('Posti esauriti per questo allenamento');
      res.send('Prenotazione effettuata con successo');
    });
  });
});

//GET delle prenotazioni agli allenamenti
router.get('/miePrenotazioni', (req, res) => {
  const { idUtente } = req.query;
  
  if (!idUtente) {
    return res.status(400).send('ID utente mancante');
  }

  const query = `
    SELECT P.idPrenotazione, A.dataAllenamento, A.oraInizio
    FROM prenotazioni P
    JOIN allenamenti A ON P.idAllenamento = A.idAllenamento
    WHERE P.idUtente = ? AND A.dataAllenamento >= CURDATE()
    ORDER By A.dataAllenamento`;

  db.query(query, [idUtente], (err, results) => {
    if (err) {
      return res.status(500).send('Errore nel recupero delle prenotazioni');
    }

    // Formattare i dati prima di inviarli al client
   const prenotazioniFormattate = results.map((prenotazione) => {
    return {
      ...prenotazione,
      dataAllenamento: new Date(prenotazione.dataAllenamento).toLocaleDateString('it-IT'), // Formatta la data in GG/MM/AAAA
      oraInizio: prenotazione.oraInizio.substring(0, 5), // Prende solo HH:MM
    };
  });
    res.json(prenotazioniFormattate);
  });
});


//DELETE della prenotazione
router.delete("/eliminaPrenotazione/:idPrenotazione", (req, res) => {
  const { idPrenotazione } = req.params;

  const deleteQuery = "DELETE FROM prenotazioni WHERE idPrenotazione = ?";
  
  db.query(deleteQuery, [idPrenotazione], (err, result) => {
    if (err) {
      console.error("Errore nella cancellazione della prenotazione:", err);
      return res.status(500).json({ error: "Errore nella cancellazione della prenotazione" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenotazione non trovata" });
    }

    res.json({ message: "Prenotazione cancellata con successo" });
  });
});


//UPDATE della prenotazione
router.put('/modificaPrenotazione/:idPrenotazione', (req, res) => {
  const { idPrenotazione } = req.params;
  const { idAllenamento } = req.body;
 
    // Controlla se l'allenamento ha ancora posti disponibili
    const checkPostiQuery = 'SELECT numPosti FROM allenamenti WHERE idAllenamento = ?';
    db.query(checkPostiQuery, [idAllenamento], (err, rows) => {
      if (err) return res.status(500).send('Errore nel controllo dei posti disponibili');
      if (rows.length === 0 || rows[0].numPosti <= 0) return res.status(400).send('Allenamento al completo');
 
      // Aggiorna la prenotazione
      const updatePrenotazioneQuery = 'UPDATE prenotazioni SET idAllenamento = ? WHERE idPrenotazione = ?';
      db.query(updatePrenotazioneQuery, [idAllenamento, idPrenotazione], (err) => {
        if (err) return res.status(500).send('Errore nella modifica della prenotazione');
 
        res.send('Prenotazione modificata con successo');
      });
    });
  });

export default router;
