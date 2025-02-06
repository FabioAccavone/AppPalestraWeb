import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Recupera le richieste di schede di un utente
router.get('/richiesteUtente/:idUtente', async (req, res) => {
    const { idUtente } = req.params;
    const query = `
    SELECT pt.nome as nome, pt.cognome as cognome, richiestescheda.stato as stato
    FROM richiestescheda 
    JOIN pt ON richiestescheda.idPT = pt.idPt
    WHERE Idutente = ?`;

    db.query(query, [idUtente], (err, result) =>{
        if (err) {
            console.error("Errore nel recupero delle schede:", err);
            return res.status(500).json({ error: "Errore nel recupero delle schede" });
        }

        res.json(result);
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
            res.message(400).json({ error: "Esiste già una richiesta in corso per questo utente" });
        }
    });
});

export default router;
