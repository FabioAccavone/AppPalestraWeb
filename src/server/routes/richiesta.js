import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Recupera le richieste di schede di un utente
router.get('/richiesteUtente/:idUtente', async (req, res) => {
    const { idUtente } = req.params;
    const query = `
    SELECT pt.nome as nome, pt.cognome as cognome, richiestescheda.stato as stato, richiestescheda.dataRichiesta as data
    FROM richiestescheda 
    JOIN pt ON richiestescheda.idPT = pt.idPt
    WHERE Idutente = ?`;

    db.query(query, [idUtente], (err, result) =>{
        if (err) {
            console.error("Errore nel recupero delle schede:", err);
            return res.status(500).json({ error: "Errore nel recupero delle schede" });
        }
       const richiestaFormattata = result.map((richiesta) =>({
        ...richiesta,
        dataRichiesta: new Date(richiesta.data).toLocaleDateString('it-IT')
       }))
        res.json(richiestaFormattata);
    })
});

// Recupera la lista dei personal trainer
router.get('/pt', async (req, res) => {
    
    const query ='SELECT IdPt, nome ,cognome FROM pt';

    db.query(query, (err, result) =>{
        if (err) {
            console.error("Errore nel recupero delle schede:", err);
            return res.status(500).json({ error: "Errore nel recupero delle schede" });
        }

        res.json(result);
    })
});

// Crea una nuova richiesta di scheda
router.post('/nuovaRichiesta', (req, res) => {
    const { idUtente, idPt } = req.body;  

    const query = 'SELECT * FROM richiestescheda WHERE idUtente = ? AND stato = "in corso"';

    db.query(query, [idUtente], (err, result) => {
        if (err) {
            console.error("Errore nel recupero delle richieste di scheda:", err);
            return res.status(500).json({ error: "Errore nel recupero delle richieste di scheda" });
        }

        if (result.length === 0) {
            const queryInsert = `
            INSERT INTO richiestescheda (idUtente, idPT, dataRichiesta, stato)
            VALUES (?, ?, CURDATE(), "in corso")`;

            db.query(queryInsert, [idUtente, idPt], (err, result) => {  // Corretto l'errore di sintassi
                if (err) {
                    console.error("Errore durante l'inserimento della richiesta di scheda:", err);
                    return res.status(500).json({ error: "Errore durante l'inserimento della richiesta di scheda" });
                }

                res.json({ message: "Richiesta creata con successo", idRichiesta: result.insertId });
            });
        } else {
            res.status(400).json({ error: "Hai già una richiesta in corso" });
        }
    });
});

//Recupera tutte le richieste fatte ad un determinato PT
router.get('/richiestePT/:idPT', async (req, res) => {
    const { idPT } = req.params;
    const query = `
    SELECT 
        rs.idRichiesta, 
        rs.idUtente, 
        u.nome, 
        u.cognome, 
        rs.stato, 
        rs.dataRichiesta 
    FROM richiestescheda rs
    JOIN utenti u ON rs.idUtente = u.idUtente
    WHERE rs.idPT = ?`;

    db.query(query, [idPT], (err, result) => {
        if (err) {
            console.error("Errore nel recupero delle richieste:", err);
            return res.status(500).json({ error: "Errore nel recupero delle richieste" });
        }
        res.json(result);
    });
});


//Aggiornamento stato richiesta
router.put('/update/:idRichiesta', async (req, res) => {
    const { idRichiesta } = req.params;
    const { stato } = req.body;

    if (!stato) {
        return res.status(400).json({ error: "Stato mancante" });
    }

    const query = 'UPDATE richiestescheda SET stato = ? WHERE idRichiesta = ?';

    db.query(query, [stato, idRichiesta], (err, result) => {
        if (err) {
            console.error("Errore nell'aggiornamento della richiesta:", err);
            return res.status(500).json({ error: "Errore nell'aggiornamento della richiesta" });
        }
        res.json({ message: "Richiesta aggiornata con successo" });
    });
});


export default router;
