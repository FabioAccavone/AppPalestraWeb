import express from 'express';
import db from '../config/db.js';

// Crea un router Express per definire rotte modulari relative alle richieste di schede e ai personal trainer
const router = express.Router();


// =========================================================
// Recupera le richieste di schede di un utente
// =========================================================
// Questa rotta GET restituisce le richieste di scheda (ad es. programmi di allenamento)
// inviate da un utente specifico, identificato dal suo idUtente.
router.get('/richiesteUtente/:idUtente', async (req, res) => {
    // Estrae l'id dell'utente dai parametri dell'URL
    const { idUtente } = req.params;
    
    // Query per recuperare i dati delle richieste di scheda, includendo
    // il nome e cognome del PT associato, lo stato della richiesta e la data della richiesta.
    const query = `
    SELECT 
        pt.nome as nome, 
        pt.cognome as cognome, 
        richiestescheda.stato as stato, 
        richiestescheda.dataRichiesta as data
    FROM richiestescheda 
    JOIN pt ON richiestescheda.idPT = pt.idPt
    WHERE Idutente = ?`;
    
    // Esegue la query sostituendo il placeholder con l'idUtente
    db.query(query, [idUtente], (err, result) =>{
        if (err) {
            console.error("Errore nel recupero delle schede:", err);
            return res.status(500).json({ error: "Errore nel recupero delle schede" });
        }
        
        // Formattta i risultati:
        // Per ogni richiesta, converte la data in formato italiano (GG/MM/AAAA).
        // Nota: il campo selezionato in query è alias "data" (non "dataRichiesta"),
        // pertanto usiamo richiesta.data per formattare la data.
        const richiestaFormattata = result.map((richiesta) => ({
            ...richiesta,
            dataRichiesta: new Date(richiesta.data).toLocaleDateString('it-IT')
        }));
        
        // Invia le richieste formattate come risposta JSON
        res.json(richiestaFormattata);
    });
});


// =========================================================
// Recupera la lista dei personal trainer (PT)
// =========================================================
// Questa rotta GET restituisce un elenco di personal trainer con i loro id, nome e cognome.
router.get('/pt', async (req, res) => {
    const query = 'SELECT IdPt, nome, cognome FROM pt';
    
    // Esegue la query per ottenere l'elenco dei PT
    db.query(query, (err, result) =>{
        if (err) {
            console.error("Errore nel recupero dei PT:", err);
            return res.status(500).json({ error: "Errore nel recupero dei PT" });
        }
        res.json(result);
    });
});


// =========================================================
// Crea una nuova richiesta di scheda
// =========================================================
// Questa rotta POST permette a un utente di inviare una nuova richiesta di scheda,
// purché non ne abbia già una "in corso".
router.post('/nuovaRichiesta', (req, res) => {
    // Estrae idUtente e idPt (id del personal trainer) dal corpo della richiesta
    const { idUtente, idPt } = req.body;  

    // Prima di creare una nuova richiesta, controlla se l'utente ha già una richiesta "in corso"
    const query = 'SELECT * FROM richiestescheda WHERE idUtente = ? AND stato = "in corso"';

    db.query(query, [idUtente], (err, result) => {
        if (err) {
            console.error("Errore nel recupero delle richieste di scheda:", err);
            return res.status(500).json({ error: "Errore nel recupero delle richieste di scheda" });
        }

        // Se non esiste già una richiesta in corso per l'utente, procedi con l'inserimento
        if (result.length === 0) {
            // Query per inserire una nuova richiesta con data corrente e stato "in corso"
            const queryInsert = `
            INSERT INTO richiestescheda (idUtente, idPT, dataRichiesta, stato)
            VALUES (?, ?, CURDATE(), "in corso")`;
            
            db.query(queryInsert, [idUtente, idPt], (err, result) => {  // Corretto l'errore di sintassi
                if (err) {
                    console.error("Errore durante l'inserimento della richiesta di scheda:", err);
                    return res.status(500).json({ error: "Errore durante l'inserimento della richiesta di scheda" });
                }
                // Restituisce un messaggio di successo e l'id della nuova richiesta
                res.json({ message: "Richiesta creata con successo", idRichiesta: result.insertId });
            });
        } else {
            // Se l'utente ha già una richiesta in corso, restituisce un errore
            res.status(400).json({ error: "Hai già una richiesta in corso" });
        }
    });
});


// =========================================================
// Recupera tutte le richieste fatte ad un determinato PT
// =========================================================
// Questa rotta GET restituisce le richieste di scheda inviate a un personal trainer specifico,
// identificato dal suo idPT.
router.get('/richiestePT/:idPT', async (req, res) => {
    // Estrae l'id del PT dai parametri dell'URL
    const { idPT } = req.params;
    
    // Query per ottenere le richieste, unendo la tabella delle richieste con quella degli utenti
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
    
    // Esegue la query sostituendo il placeholder con l'id del PT
    db.query(query, [idPT], (err, result) => {
        if (err) {
            console.error("Errore nel recupero delle richieste:", err);
            return res.status(500).json({ error: "Errore nel recupero delle richieste" });
        }
        res.json(result);
    });
});


// =========================================================
// Aggiornamento dello stato di una richiesta di scheda
// =========================================================
// Questa rotta PUT permette di aggiornare lo stato di una richiesta di scheda,
// identificata dal suo idRichiesta. Lo stato potrebbe essere, ad esempio, "approvata" o "rifiutata".
router.put('/update/:idRichiesta', async (req, res) => {
    // Estrae l'id della richiesta dai parametri dell'URL
    const { idRichiesta } = req.params;
    // Estrae il nuovo stato dal corpo della richiesta
    const { stato } = req.body;

    // Se il nuovo stato non viene fornito, restituisce un errore
    if (!stato) {
        return res.status(400).json({ error: "Stato mancante" });
    }

    // Query per aggiornare lo stato della richiesta specificata
    const query = 'UPDATE richiestescheda SET stato = ? WHERE idRichiesta = ?';

    db.query(query, [stato, idRichiesta], (err, result) => {
        if (err) {
            console.error("Errore nell'aggiornamento della richiesta:", err);
            return res.status(500).json({ error: "Errore nell'aggiornamento della richiesta" });
        }
        // Invia un messaggio di conferma in caso di aggiornamento riuscito
        res.json({ message: "Richiesta aggiornata con successo" });
    });
});


// Esporta il router in modo che possa essere utilizzato nel file principale dell'applicazione
export default router;
