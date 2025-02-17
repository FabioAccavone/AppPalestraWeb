import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Crea un router Express per definire rotte modulari
const router = express.Router();

// Rotta POST per gestire il login degli utenti
router.post('/login', (req, res) => {
  // Estrae da req.body i parametri inviati: username, password e ruolo
  const { username, password, role } = req.body;
  
  // Variabile per memorizzare la query SQL da eseguire in base al ruolo
  let query = '';
  // Variabile per salvare l'ID dell'utente una volta trovato
  let userId = null;

  // Seleziona la query SQL in base al valore del parametro 'role'
  switch (role) {
    case 'utente':
      // Se il ruolo è 'utente', cerca nella tabella 'utenti'
      query = 'SELECT * FROM utenti WHERE username = ?';
      break;
    case 'pt':
      // Se il ruolo è 'pt', cerca nella tabella 'pt'
      query = 'SELECT * FROM pt WHERE username = ?';
      break;
    case 'admin':
      // Se il ruolo è 'admin', cerca nella tabella 'admin'
      query = 'SELECT * FROM admin WHERE username = ?';
      break;
    default:
      // Se il ruolo non è riconosciuto, restituisce un errore 400 (Bad Request)
      return res.status(400).send('Ruolo non valido');
  }

  // Esegue la query al database sostituendo il placeholder '?' con il valore 'username'
  db.query(query, [username], (err, results) => {
    // Se c'è un errore durante l'esecuzione della query, invia una risposta 500 (Internal Server Error)
    if (err) return res.status(500).send('Database error');
    // Se non viene trovato nessun utente, invia una risposta 401 (Unauthorized)
    if (results.length === 0) return res.status(401).send('User not found');

    // Estrae il primo risultato (l'utente trovato)
    const user = results[0];

    // Assegna l'ID corretto dell'utente in base al ruolo
    switch(role) {
      case 'utente':
        userId = user.idUtente;
        break;
      case 'pt':
        userId = user.idPT;
        break;
      case 'admin':
        userId = user.idAdmin;
        break;
      default:
        userId = null;
    }

    // Confronta la password fornita con quella memorizzata (hashata) nel database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      // Se si verifica un errore durante il confronto della password, restituisce un errore 500
      if (err) return res.status(500).send('Error during password comparison');
      // Se le password non corrispondono, invia una risposta 401 (Unauthorized)
      if (!isMatch) return res.status(401).send('Invalid password');

      // Se il confronto ha successo, crea un token JWT contenente l'ID dell'utente e il suo ruolo
      // Il token scade dopo 1 ora
      const token = jwt.sign({ id: userId, role }, 'your_jwt_secret', { expiresIn: '1h' });
      
      // Invia una risposta JSON contenente il token, il ruolo e l'ID dell'utente
      res.json({ token, role, id: userId });
    });
  });
});

// Esporta il router per essere utilizzato nel file principale dell'applicazione
export default router;
