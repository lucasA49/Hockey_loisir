// server/db.js
const Database = require("better-sqlite3");

// Crée (ou ouvre) le fichier dogz.db
const db = new Database("dogz.db");

// On crée toutes les tables nécessaires si elles n'existent pas
db.exec(`
  -- Table des licenciés (joueurs)
  CREATE TABLE IF NOT EXISTS licencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    date_naissance TEXT NOT NULL,
    licence TEXT NOT NULL UNIQUE,
    poste TEXT,
    telephone TEXT,
    statut TEXT DEFAULT 'Actif'
  );

  -- Table des administrateurs (accès au panel admin)
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    nom TEXT,
    role TEXT DEFAULT 'admin',
    date_creation TEXT DEFAULT (datetime('now'))
  );

  -- Table des matchs (futurs & passés)
  CREATE TABLE IF NOT EXISTS matchs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_match TEXT NOT NULL,
    heure_match TEXT NOT NULL,
    adversaire TEXT NOT NULL,
    lieu TEXT NOT NULL,
    score_dogz INTEGER,
    score_adv INTEGER,
    statut TEXT NOT NULL DEFAULT 'À venir', -- À venir / Terminé / Annulé
    type TEXT,                              -- Amical / Tournoi / etc.
    commentaire TEXT
  );

  -- Table des événements du calendrier
  CREATE TABLE IF NOT EXISTS evenements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_event TEXT NOT NULL,
    heure_event TEXT NOT NULL,
    titre TEXT NOT NULL,
    type TEXT NOT NULL,                     -- entrainement / match / extra
    statut TEXT NOT NULL DEFAULT 'Confirmé',-- Confirmé / À confirmer / Annulé
    match_id INTEGER,                       -- optionnel, lien vers un match
    FOREIGN KEY (match_id) REFERENCES matchs(id) ON DELETE SET NULL
  );
`);

module.exports = db;
