import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
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
    var userId;
    switch (role) {
      case 'utente':
          userId = user.idUtente;
          break;
      case 'pt':
          userId = user.idPT;
          break;
      case 'admin':
          userId = user.idAdmin;
          break;
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error during password comparison');
      if (!isMatch) return res.status(401).send('Invalid password');

      const token = jwt.sign({ id: user.idUtente, role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, role, id: userId });
    });
  });
});

export default router;
