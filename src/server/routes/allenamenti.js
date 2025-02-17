import express from 'express';
import db from '../config/db.js';

// Crea un router per definire delle rotte modulari
const router = express.Router();

// Rotta GET per recuperare gli allenamenti disponibili per una data, 
// controllando anche che l'utente non abbia già prenotato per quella data
router.get('/allenamentiDisponibili', (req, res) => {
  // Estrae i parametri 'data' e 'idUtente' dalla query string della richiesta
  const { data, idUtente } = req.query;

  // Query per verificare se l'utente ha già prenotato un allenamento in quella data
  const checkPrenotazioneQuery = `
    SELECT COUNT(*) AS count 
    FROM prenotazioni p
    JOIN allenamenti a ON p.idAllenamento = a.idAllenamento
    WHERE p.idUtente = ? AND a.dataAllenamento = ?;
  `;

  // Esegue la query sul database sostituendo i placeholder con 'idUtente' e 'data'
  db.query(checkPrenotazioneQuery, [idUtente, data], (err, results) => {
    // Se c'è un errore nella query, invia una risposta con status 500
    if (err) return res.status(500).send('Errore nel controllo delle prenotazioni');

    // Se il conteggio è maggiore di 0, l'utente ha già una prenotazione per quella data
    if (results[0].count > 0) {
      return res.json({ message: "Hai già una prenotazione per questa data." });
    }

    // Query per recuperare gli allenamenti disponibili per la data specificata:
    // - devono essere nella data indicata
    // - devono avere posti disponibili (numPosti > 0)
    // - e l'utente non deve aver già prenotato quell'allenamento
    const getAllenamentiQuery = `
      SELECT * FROM allenamenti 
      WHERE dataAllenamento = ? 
      AND numPosti > 0 
      AND idAllenamento NOT IN (
        SELECT idAllenamento FROM prenotazioni WHERE idUtente = ?
      );
    `;

    // Esegue la query per ottenere gli allenamenti disponibili
    db.query(getAllenamentiQuery, [data, idUtente], (err, allenamenti) => {
      // Se c'è un errore nella query, invia una risposta con status 500
      if (err) return res.status(500).send('Errore nel recupero degli allenamenti');

      // Se non sono stati trovati allenamenti, invia un messaggio informativo
      if (allenamenti.length === 0) {
        return res.json({ message: "Nessun allenamento disponibile per questa data." });
      }

      // Formatta i dati degli allenamenti:
      // - Converte la data in formato italiano (gg/mm/aaaa)
      // - Trunca l'orario di inizio per mostrare solo le prime 5 cifre (HH:MM)
      const allenamentiFormattati = allenamenti.map((allenamento) => ({
        ...allenamento,
        dataAllenamento: new Date(allenamento.dataAllenamento).toLocaleDateString('it-IT'),
        oraInizio: allenamento.oraInizio.substring(0, 5),
      }));

      // Restituisce i dati formattati in formato JSON
      res.json(allenamentiFormattati);
    });
  });
});

// Rotta GET per recuperare gli allenamenti disponibili per la modifica,
// senza controllare se l'utente ha già prenotato (più generico)
router.get('/allenamentiDisponibiliModifica', (req, res) => {
  // Estrae i parametri 'data' e 'idUtente' dalla query string (anche se 'idUtente' non viene usato nella query)
  const { data, idUtente } = req.query;

  // Query per ottenere tutti gli allenamenti della data specificata che hanno ancora posti disponibili
  const getAllenamentiQuery = `
    SELECT * FROM allenamenti 
    WHERE dataAllenamento = ? 
    AND numPosti > 0;
  `;

  // Esegue la query sul database
  db.query(getAllenamentiQuery, [data, idUtente], (err, allenamenti) => {
    // Se c'è un errore nella query, invia una risposta con status 500
    if (err) return res.status(500).send('Errore nel recupero degli allenamenti');

    // Se non ci sono allenamenti disponibili, invia un messaggio informativo
    if (allenamenti.length === 0) {
      return res.json({ message: "Nessun allenamento disponibile per questa data." });
    }

    // Formattta i dati degli allenamenti come nella rotta precedente:
    // - Data in formato italiano
    // - Ora di inizio troncata a 'HH:MM'
    const allenamentiFormattati = allenamenti.map((allenamento) => ({
      ...allenamento,
      dataAllenamento: new Date(allenamento.dataAllenamento).toLocaleDateString('it-IT'),
      oraInizio: allenamento.oraInizio.substring(0, 5),
    }));

    // Restituisce i dati formattati in formato JSON
    res.json(allenamentiFormattati);
  });
});

// Esporta il router per poterlo utilizzare nel file principale del server
export default router;
