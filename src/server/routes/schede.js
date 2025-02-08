import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 📌 Ottieni le schede dell'utente con nome del PT
router.get("/mieSchede", (req, res) => {
  const { idUtente } = req.query;

  if (!idUtente) {
    return res.status(400).json({ error: "ID utente mancante" });
  }

  const query = `
    SELECT S.idScheda, S.dataInizio, S.dataFine, PT.nome AS nomePT, PT.cognome AS cognomePT
    FROM schede S
    JOIN pt PT ON S.idPT = PT.idPT 
    WHERE S.idUtente = ?`;

  db.query(query, [idUtente], (err, results) => {
    if (err) {
      console.error("Errore nel recupero delle schede:", err);
      return res.status(500).json({ error: "Errore nel recupero delle schede" });
    }

    const schedaFormattata = results.map((scheda) => ({
        ...scheda,
        dataInizio: new Date(scheda.dataInizio).toLocaleDateString('it-IT'),
        dataFine: new Date(scheda.dataFine).toLocaleDateString('it-IT'),
      }));

    res.json(schedaFormattata);
  });
});

// 📌 Ottieni i dettagli di una scheda (utente + esercizi)
router.get("/dettagliScheda/:idScheda", (req, res) => {
    const { idScheda } = req.params;
  
    const query = `
      SELECT 
          S.dataInizio, 
          S.dataFine,
          U.nome AS nomeUtente, 
          U.cognome AS cognomeUtente, 
          U.peso AS pesoUtente,
          PT.nome AS nomePT, 
          PT.cognome AS cognomePT,
          E.nome AS nomeEsercizio, 
          SE.peso AS pesoEsercizio, 
          SE.serie, 
          SE.ripetizioni
      FROM Schede S
      JOIN Utenti U ON S.idUtente = U.idUtente
      JOIN PT ON S.idPT = PT.idPT
      JOIN SchedaEsercizi SE ON S.idScheda = SE.idScheda
      JOIN Esercizi E ON SE.idEsercizio = E.idEsercizio
      WHERE S.idScheda = ?;
    `;
  
    db.query(query, [idScheda], (err, results) => {
      if (err) {
        console.error("Errore nel recupero dei dettagli della scheda:", err);
        return res.status(500).json({ error: "Errore nel recupero dei dettagli" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Scheda non trovata" });
      }
  
      const dettagli = {
        dataInizio:  new Date(results[0].dataInizio).toLocaleDateString('it-IT'),
        dataFine: new Date(results[0].dataFine).toLocaleDateString('it-IT'),
        nomeUtente: results[0].nomeUtente,
        cognomeUtente: results[0].cognomeUtente,
        pesoUtente: results[0].pesoUtente,
        nomePT: results[0].nomePT,
        cognomePT: results[0].cognomePT,
        esercizi: results.map((row) => ({
          nomeEsercizio: row.nomeEsercizio,
          pesoEsercizio: row.pesoEsercizio,
          serie: row.serie,
          ripetizioni: row.ripetizioni,
        })),
      };
  
      res.json(dettagli);
    });
  });
  
  
// Creazione di una nuova scheda di allenamento
router.post('/creaScheda', async (req, res) => {
  const { dataInizio, dataFine, idUtente, idPT } = req.body;

  const query = 'INSERT INTO scheda (dataInizio, dataFine, idUtente, idPT) VALUES (?, ?, ?, ?)';
  
  db.query(query, [dataInizio, dataFine, idUtente, idPT], (err, result) => {
      if (err) {
          console.error("Errore nella creazione della scheda:", err);
          return res.status(500).json({ error: "Errore nella creazione della scheda" });
      }
      res.json({ message: "Scheda creata con successo", idScheda: result.insertId });
  });
});

//Aggiunta degli esercizi alla scheda
router.post('/aggiungiEsercizio', async (req, res) => {
  const { idScheda, esercizi } = req.body;

  if (!idScheda || !esercizi || esercizi.length === 0) {
      return res.status(400).json({ error: "Dati mancanti" });
  }

  const query = 'INSERT INTO schedaesercizi (idScheda, idEsercizio, peso, serie, ripetizioni) VALUES ?';
  
  const values = esercizi.map(ex => [idScheda, ex.idEsercizio, ex.peso, ex.serie, ex.ripetizioni]);

  db.query(query, [values], (err) => {
      if (err) {
          console.error("Errore nell'inserimento esercizi:", err);
          return res.status(500).json({ error: "Errore nell'inserimento esercizi" });
      }
      res.json({ message: "Esercizi aggiunti con successo" });
  });
});


// Recupera tutti gli esercizi disponibili
router.get('/esercizi', async (req, res) => {
  const query = 'SELECT idEsercizio, nome FROM esercizi'; // Assumendo che ci sia una tabella "esercizi"

  db.query(query, (err, results) => {
      if (err) {
          console.error("Errore nel recupero degli esercizi:", err);
          return res.status(500).json({ error: "Errore nel recupero degli esercizi" });
      }
      res.json(results);
  });
});


export default router;
