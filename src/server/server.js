import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/auth.js';
import allenamentiRoutes from './routes/allenamenti.js';
import prenotazioniRoutes from './routes/prenotazioni.js';

const app = express();

app.use(express.json());
app.use(cors());

// Usiamo le route modulari
app.use('/api/auth', authRoutes);
app.use('/api/allenamenti', allenamentiRoutes);
app.use('/api/prenotazioni', prenotazioniRoutes);

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
