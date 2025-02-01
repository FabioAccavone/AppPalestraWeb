import mysql from 'mysql2';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

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
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error during password comparison');
      if (!isMatch) return res.status(401).send('Invalid password');

      const token = jwt.sign({ id: user.idUtente, role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, role, id: user.idUtente});
    });
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
