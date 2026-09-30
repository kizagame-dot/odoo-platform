const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Connexion à la base de données via les variables d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialisation de la table au démarrage
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );
`).catch(err => console.error('Erreur création table', err));

// Route GET : Récupérer les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Route POST : Ajouter un utilisateur
app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO users(name) VALUES($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
