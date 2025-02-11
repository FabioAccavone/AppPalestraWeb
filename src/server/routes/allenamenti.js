import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/allenamentiDisponibili', (req, res) => {
  const { data, idUtente } = req.query;

  const checkPrenotazioneQuery = `
    SELECT COUNT(*) AS count 
    FROM prenotazioni p
    JOIN allenamenti a ON p.idAllenamento = a.idAllenamento
    WHERE p.idUtente = ? AND a.dataAllenamento = ?;
  `;

  db.query(checkPrenotazioneQuery, [idUtente, data], (err, results) => {
    if (err) return res.status(500).send('Errore nel controllo delle prenotazioni');

    if (results[0].count > 0) {
      return res.json({ message: "Hai già una prenotazione per questa data." });
    }

    const getAllenamentiQuery = `
      SELECT * FROM allenamenti 
      WHERE dataAllenamento = ? 
      AND numPosti > 0 
      AND idAllenamento NOT IN (
        SELECT idAllenamento FROM prenotazioni WHERE idUtente = ?
      );
    `;

    db.query(getAllenamentiQuery, [data, idUtente], (err, allenamenti) => {
      if (err) return res.status(500).send('Errore nel recupero degli allenamenti');

      if (allenamenti.length === 0) {
        return res.json({ message: "Nessun allenamento disponibile per questa data." });
      }

      const allenamentiFormattati = allenamenti.map((allenamento) => ({
        ...allenamento,
        dataAllenamento: new Date(allenamento.dataAllenamento).toLocaleDateString('it-IT'),
        oraInizio: allenamento.oraInizio.substring(0, 5),
      }));

      res.json(allenamentiFormattati);
    });
  });
});

router.get('/allenamentiDisponibiliModifica', (req, res) => {
    const { data, idUtente } = req.query;

    const getAllenamentiQuery = `
      SELECT * FROM allenamenti 
      WHERE dataAllenamento = ? 
      AND numPosti > 0;
    `;

    db.query(getAllenamentiQuery, [data, idUtente], (err, allenamenti) => {
      if (err) return res.status(500).send('Errore nel recupero degli allenamenti');

      if (allenamenti.length === 0) {
        return res.json({ message: "Nessun allenamento disponibile per questa data." });
      }

      const allenamentiFormattati = allenamenti.map((allenamento) => ({
        ...allenamento,
        dataAllenamento: new Date(allenamento.dataAllenamento).toLocaleDateString('it-IT'),
        oraInizio: allenamento.oraInizio.substring(0, 5),
      }));

      res.json(allenamentiFormattati);
    });
});

export default router;
