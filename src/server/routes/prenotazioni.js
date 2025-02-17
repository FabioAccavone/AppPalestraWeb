import express from 'express';
import db from '../config/db.js';

// Crea un router Express per definire rotte modulari relative alle prenotazioni
const router = express.Router();


// =========================================================
// Inserimento di una nuova Prenotazione e aggiornamento dei posti
// =========================================================
router.post('/prenotaAllenamento', (req, res) => {
  // Estrae idUtente e idAllenamento dal corpo della richiesta
  const { idUtente, idAllenamento } = req.body;

  // Query per inserire una nuova prenotazione con la data corrente
  const prenotazioneQuery = 'INSERT INTO prenotazioni (dataPrenotazione, idUtente, idAllenamento) VALUES (CURDATE(), ?, ?)';
  // Query per decrementare il numero di posti disponibili per l'allenamento, solo se ce ne sono
  const updateQuery = 'UPDATE allenamenti SET numPosti = numPosti - 1 WHERE idAllenamento = ? AND numPosti > 0';

  // Esegue la query per inserire la prenotazione
  db.query(prenotazioneQuery, [idUtente, idAllenamento], (err) => {
    if (err) 
      return res.status(500).send('Errore nella prenotazione');

    // Dopo aver inserito la prenotazione, aggiorna il numero di posti disponibili
    db.query(updateQuery, [idAllenamento], (err, result) => {
      if (err) 
        return res.status(500).send('Errore nell’aggiornamento');

      // Se nessuna riga è stata aggiornata, significa che non ci sono più posti disponibili
      if (result.affectedRows === 0) 
        return res.status(400).send('Posti esauriti per questo allenamento');

      // Se tutto va bene, invia una conferma della prenotazione
      res.send('Prenotazione effettuata con successo');
    });
  });
});


// =========================================================
// GET delle prenotazioni agli allenamenti per un utente specifico
// =========================================================
router.get('/miePrenotazioni', (req, res) => {
  // Estrae l'idUtente dalla query string
  const { idUtente } = req.query;
  
  // Se l'idUtente non viene fornito, restituisce un errore
  if (!idUtente) {
    return res.status(400).send('ID utente mancante');
  }

  // Query che recupera le prenotazioni future dell'utente unendo le tabelle prenotazioni e allenamenti
  const query = `
    SELECT P.idPrenotazione, A.dataAllenamento, A.oraInizio
    FROM prenotazioni P
    JOIN allenamenti A ON P.idAllenamento = A.idAllenamento
    WHERE P.idUtente = ? AND A.dataAllenamento >= CURDATE()
    ORDER By A.dataAllenamento`;
  
  // Esegue la query
  db.query(query, [idUtente], (err, results) => {
    if (err) {
      return res.status(500).send('Errore nel recupero delle prenotazioni');
    }

    // Per ogni prenotazione, formatta la data e l'orario prima di inviare la risposta
    const prenotazioniFormattate = results.map((prenotazione) => {
      return {
        ...prenotazione,
        // Formattta la data in formato italiano (GG/MM/AAAA)
        dataAllenamento: new Date(prenotazione.dataAllenamento).toLocaleDateString('it-IT'),
        // Prende solo i primi 5 caratteri dell'orario (HH:MM)
        oraInizio: prenotazione.oraInizio.substring(0, 5),
      };
    });
    res.json(prenotazioniFormattate);
  });
});


// =========================================================
// DELETE della prenotazione
// =========================================================
router.delete("/eliminaPrenotazione/:idPrenotazione", (req, res) => {
  // Estrae l'id della prenotazione dai parametri dell'URL
  const { idPrenotazione } = req.params;

  // Query per eliminare la prenotazione corrispondente
  const deleteQuery = "DELETE FROM prenotazioni WHERE idPrenotazione = ?";
  
  db.query(deleteQuery, [idPrenotazione], (err, result) => {
    if (err) {
      console.error("Errore nella cancellazione della prenotazione:", err);
      return res.status(500).json({ error: "Errore nella cancellazione della prenotazione" });
    }

    // Se nessuna riga è stata interessata, la prenotazione non esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenotazione non trovata" });
    }

    // Restituisce un messaggio di successo
    res.json({ message: "Prenotazione cancellata con successo" });
  });
});


// =========================================================
// UPDATE della prenotazione
// =========================================================
router.put('/modificaPrenotazione/:idPrenotazione', (req, res) => {
  // Estrae l'id della prenotazione dai parametri dell'URL
  const { idPrenotazione } = req.params;
  // Estrae l'idAllenamento dal corpo della richiesta (nuovo allenamento selezionato)
  const { idAllenamento } = req.body;
 
  // Prima di aggiornare la prenotazione, controlla se l'allenamento ha posti disponibili
  const checkPostiQuery = 'SELECT numPosti FROM allenamenti WHERE idAllenamento = ?';
  db.query(checkPostiQuery, [idAllenamento], (err, rows) => {
    if (err) 
      return res.status(500).send('Errore nel controllo dei posti disponibili');

    // Se l'allenamento non esiste o non ha posti disponibili, invia un errore
    if (rows.length === 0 || rows[0].numPosti <= 0) 
      return res.status(400).send('Allenamento al completo');
 
    // Se c'è disponibilità, aggiorna la prenotazione con il nuovo idAllenamento
    const updatePrenotazioneQuery = 'UPDATE prenotazioni SET idAllenamento = ? WHERE idPrenotazione = ?';
    db.query(updatePrenotazioneQuery, [idAllenamento, idPrenotazione], (err) => {
      if (err) 
        return res.status(500).send('Errore nella modifica della prenotazione');
 
      // Invia un messaggio di successo se la modifica è andata a buon fine
      res.send('Prenotazione modificata con successo');
    });
  });
});


// Esporta il router per poter essere utilizzato nel file principale dell'applicazione
export default router;
