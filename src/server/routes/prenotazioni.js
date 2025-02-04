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
export default router;
