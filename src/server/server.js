import mysql from 'mysql2'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Inserisci qui il tuo utente
  password: 'ProgrammazioneWeb2025', // Inserisci qui la tua password
  database: 'dbweb' // Inserisci il nome del tuo DB
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});



const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(401).send('User not found');

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error during password comparison');
      if (!isMatch) return res.status(401).send('Invalid password');

      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Catch all errors
app.use((err, req, res, next) => {
  console.error(err.stack);  // Stampa l'errore nel terminale
  res.status(500).send('Qualcosa è andato storto!');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
