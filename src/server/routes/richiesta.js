import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Recupera le richieste di schede di un utente
router.get('/richiesta/:idUtente', async (req, res) => {
    const { idUtente } = req.params;
    try {
        const [result] = pool.query('SELECT * FROM richiestascheda WHERE Idutente = ?', [idUtente]);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero delle richieste' });
    }
});

// Recupera la lista dei personal trainer
router.get('/pt', async (req, res) => {
    try {
        const [result] =  pool.query('SELECT IdPt, nome ,cognome FROM pt');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero dei personal trainer' });
    }
});

// Crea una nuova richiesta di scheda
router.post('/nuovaRichiesta', async (req, res) => {
    const { Idutente, IdPt } = req.body;
    try {
        // Controlla se l'utente ha già una richiesta "in corso"
        const [existing] =  pool.query('SELECT * FROM richiestascheda WHERE Idutente = ? AND stato = "in corso"', [Idutente]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Hai già una richiesta in corso' });
        }
        
        // Inserisce la nuova richiesta
        const [result] =  pool.query('INSERT INTO richiestascheda (Idutente, IdPt, dataRichiesta, stato) VALUES (?, ?, NOW(), "in corso")', [Idutente, IdPt]);
        res.json({ message: 'Richiesta creata con successo', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nella creazione della richiesta' });
    }
});

export default router;
