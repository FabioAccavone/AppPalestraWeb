import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ProgrammazioneWeb2025',
  database: 'dbweb'
});

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    process.exit(1);
  }
  console.log('✅ Database connesso!');
});

export default db;
