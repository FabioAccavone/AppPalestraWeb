import mysql from 'mysql2';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { all } from 'axios';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ProgrammazioneWeb2025',
  database: 'dbweb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
  const { username, password, role } = req.body; // Aggiunto il ruolo
  let query;

  if (role === 'utente') {
    query = 'SELECT * FROM utenti WHERE username = ?';
  } else if (role === 'pt') {
    query = 'SELECT * FROM pt WHERE username = ?';
  } else {
    return res.status(400).send('Ruolo non valido');
  }

  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(401).send('User not found');

    const user = results[0];
    const idUtente = user.idUtente;
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error during password comparison');
      if (!isMatch) return res.status(401).send('Invalid password');

      const token = jwt.sign({ id: user.idUtente, role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, role, idUtente});
    });
  });
});

//GET degli allenamenti disponibili
app.get('/allenamentiDisponibili', (req, res) => {
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
      if (err) return allenamenti.status(500).send('Errore nel recupero degli allenamenti');

      if (allenamenti.length === 0) {
        return res.json({ message: "Nessun allenamento disponibile per questa data." });
      }
    // Formattare i dati prima di inviarli al client
      const allenamentiFormattati = allenamenti.map((allenamento) => {
        return {
          ...allenamento,
          dataAllenamento: new Date(allenamento.dataAllenamento).toLocaleDateString('it-IT'), // Formatta la data in GG/MM/AAAA
          oraInizio: allenamento.oraInizio.substring(0, 5), // Prende solo HH:MM
        };
      });
    
      res.json(allenamentiFormattati);
    });
  });
});


//Inserimento di una prenotazione e modifica del numero di posti disponibili per quell'allenamento
app.post('/prenotaAllenamento', (req, res) => {
  const { idUtente, idAllenamento } = req.body;

  const prenotazioneQuery = 'INSERT INTO prenotazioni (dataPrenotazione, idUtente, idAllenamento) VALUES (CURDATE(), ?, ?)';
  const updateQuery = 'UPDATE allenamenti SET numPosti = numPosti - 1 WHERE idAllenamento = ? AND numPosti > 0';

  db.query(prenotazioneQuery, [idUtente, idAllenamento], (err) => {
    if (err) return res.status(500).send('Errore nella prenotazione');
    
    db.query(updateQuery, [idAllenamento], (err, result) => {
      if (err) return res.status(500).send('Errore nell’aggiornamento');

      if (result.affectedRows === 0) {
        return res.status(400).send('Posti esauriti per questo allenamento');
      }

      res.send('Prenotazione effettuata con successo');
    });
  });
});

//GET delle prenotazioni agli allenamenti
app.get('/miePrenotazioni', (req, res) => {
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

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
