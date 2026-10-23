// server/db.js
const Database = require("better-sqlite3");
const path = require("path");

// Crée (ou ouvre) le fichier dogz.db à côté de ce fichier
const db = new Database(path.join(__dirname, "dogz.db"));

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
    niveau TEXT,                            -- Débutant / Intermédiaire / Confirmé
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

  -- Lignes de la composition d'un match (attaque / défense / gardien)
  CREATE TABLE IF NOT EXISTS match_lignes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    categorie TEXT NOT NULL CHECK (categorie IN ('attaque', 'defense', 'gardien')),
    numero INTEGER NOT NULL,                -- Ligne 1, Ligne 2...
    FOREIGN KEY (match_id) REFERENCES matchs(id) ON DELETE CASCADE,
    UNIQUE (match_id, categorie, numero)
  );

  -- Joueurs placés dans une ligne
  CREATE TABLE IF NOT EXISTS match_ligne_joueurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ligne_id INTEGER NOT NULL,
    prenom TEXT NOT NULL,
    ordre INTEGER NOT NULL,
    FOREIGN KEY (ligne_id) REFERENCES match_lignes(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_match_lignes_match ON match_lignes(match_id);
  CREATE INDEX IF NOT EXISTS idx_ligne_joueurs_ligne ON match_ligne_joueurs(ligne_id);
`);

db.pragma("foreign_keys = ON");

// Migrations : ajoute les colonnes manquantes sur une base existante
const colonnesMatchs = db.prepare("PRAGMA table_info(matchs)").all().map((c) => c.name);
if (!colonnesMatchs.includes("niveau")) {
  db.exec("ALTER TABLE matchs ADD COLUMN niveau TEXT");
}

module.exports = db;
