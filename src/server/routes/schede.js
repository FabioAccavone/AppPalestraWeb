import express from "express";
import db from "../config/db.js";

// Crea un router Express per gestire le rotte relative alle schede di allenamento e agli esercizi
const router = express.Router();


// =========================================================
//  Ottieni le schede dell'utente con nome del PT
// =========================================================
// Questa rotta GET restituisce le schede (piani di allenamento) associate a un utente,
// includendo le date di inizio/fine e il nome e cognome del Personal Trainer (PT)
router.get("/mieSchede", (req, res) => {
  // Estrae l'ID dell'utente dalla query string
  const { idUtente } = req.query;

  // Se l'ID utente non viene fornito, restituisce un errore 400
  if (!idUtente) {
    return res.status(400).json({ error: "ID utente mancante" });
  }

  // Query per selezionare le schede dell'utente, unendo la tabella schede con quella dei PT
  const query = `
    SELECT S.idScheda, S.dataInizio, S.dataFine, PT.nome AS nomePT, PT.cognome AS cognomePT
    FROM schede S
    JOIN pt PT ON S.idPT = PT.idPT 
    WHERE S.idUtente = ?`;

  // Esegue la query sostituendo il placeholder con l'ID utente
  db.query(query, [idUtente], (err, results) => {
    if (err) {
      console.error("Errore nel recupero delle schede:", err);
      return res.status(500).json({ error: "Errore nel recupero delle schede" });
    }

    // Formattta le date (dataInizio e dataFine) nel formato italiano (GG/MM/AAAA)
    const schedaFormattata = results.map((scheda) => ({
      ...scheda,
      dataInizio: new Date(scheda.dataInizio).toLocaleDateString('it-IT'),
      dataFine: new Date(scheda.dataFine).toLocaleDateString('it-IT'),
    }));

    // Invia le schede formattate come risposta JSON
    res.json(schedaFormattata);
  });
});


// =========================================================
// 2. Ottieni i dettagli di una scheda (utente + esercizi)
// =========================================================
// Questa rotta GET restituisce i dettagli di una scheda specifica, inclusi i dati dell'utente,
// del PT e degli esercizi associati alla scheda
router.get("/dettagliScheda/:idScheda", (req, res) => {
  // Estrae l'ID della scheda dai parametri dell'URL
  const { idScheda } = req.params;

  // Query che unisce più tabelle per ottenere:
  // - le date di inizio e fine della scheda,
  // - i dati dell'utente (nome, cognome, peso),
  // - i dati del PT (nome, cognome),
  // - i dettagli degli esercizi (nome, peso, serie, ripetizioni)
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

  // Esegue la query sostituendo il placeholder con l'ID della scheda
  db.query(query, [idScheda], (err, results) => {
    if (err) {
      console.error("Errore nel recupero dei dettagli della scheda:", err);
      return res.status(500).json({ error: "Errore nel recupero dei dettagli" });
    }

    // Se non viene trovata nessuna scheda, restituisce un errore 404
    if (results.length === 0) {
      return res.status(404).json({ message: "Scheda non trovata" });
    }

    // Costruisce un oggetto "dettagli" utilizzando il primo risultato per le informazioni generali
    // e mappa tutti i record per creare un array degli esercizi associati
    const dettagli = {
      dataInizio: new Date(results[0].dataInizio).toLocaleDateString('it-IT'),
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

    // Invia i dettagli della scheda come risposta JSON
    res.json(dettagli);
  });
});


// =========================================================
// 3. Creazione di una nuova scheda di allenamento
// =========================================================
// Questa rotta POST consente di creare una nuova scheda di allenamento per un utente,
// specificando le date di inizio/fine, l'ID utente e l'ID del PT.
router.post('/creaScheda', async (req, res) => {
  // Estrae i dati necessari dal corpo della richiesta
  const { dataInizio, dataFine, idUtente, idPT } = req.body;

  // Query per inserire una nuova scheda nella tabella "schede"
  const query = 'INSERT INTO schede (dataInizio, dataFine, idUtente, idPT) VALUES (?, ?, ?, ?)';

  // Esegue la query sostituendo i placeholder con i valori forniti
  db.query(query, [dataInizio, dataFine, idUtente, idPT], (err, result) => {
    if (err) {
      console.error("Errore nella creazione della scheda:", err);
      return res.status(500).json({ error: "Errore nella creazione della scheda" });
    }
    // Restituisce un messaggio di successo insieme all'ID della scheda creata
    res.json({ message: "Scheda creata con successo", idScheda: result.insertId });
  });
});


// =========================================================
// 4. Aggiunta degli esercizi alla scheda
// =========================================================
// Questa rotta POST permette di associare uno o più esercizi a una scheda,
// inserendo i dettagli (peso, serie, ripetizioni) per ciascun esercizio.
router.post('/aggiungiEsercizio', async (req, res) => {
  // Estrae l'ID della scheda e l'array degli esercizi dal corpo della richiesta
  const { idScheda, esercizi } = req.body;

  // Verifica che tutti i dati necessari siano presenti
  if (!idScheda || !esercizi || esercizi.length === 0) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  // Query per inserire più record nella tabella "schedaesercizi"
  // Utilizza la sintassi "INSERT ... VALUES ?" per inserire in blocco
  const query = 'INSERT INTO schedaesercizi (idScheda, idEsercizio, peso, serie, ripetizioni) VALUES ?';

  // Crea un array di valori per ogni esercizio
  const values = esercizi.map(ex => [idScheda, ex.idEsercizio, ex.peso, ex.serie, ex.ripetizioni]);

  // Esegue la query per inserire tutti gli esercizi associati alla scheda
  db.query(query, [values], (err) => {
    if (err) {
      console.error("Errore nell'inserimento esercizi:", err);
      return res.status(500).json({ error: "Errore nell'inserimento esercizi" });
    }
    res.json({ message: "Esercizi aggiunti con successo" });
  });
});


// =========================================================
// 5. Recupera tutti gli esercizi disponibili
// =========================================================
// Questa rotta GET restituisce un elenco di esercizi disponibili,
// ad esempio per popolare un menu a tendina o una lista di scelta.
router.get('/esercizi', async (req, res) => {
  // Query per selezionare l'ID e il nome degli esercizi dalla tabella "esercizi"
  const query = 'SELECT idEsercizio, nome FROM esercizi';

  // Esegue la query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Errore nel recupero degli esercizi:", err);
      return res.status(500).json({ error: "Errore nel recupero degli esercizi" });
    }
    res.json(results);
  });
});


// Esporta il router in modo da poter essere utilizzato nel file principale dell'applicazione
export default router;
