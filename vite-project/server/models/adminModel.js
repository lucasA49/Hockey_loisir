// server/models/adminModel.js
const db = require("../db");
const bcrypt = require("bcryptjs");

// Créer un admin (avec hash du mot de passe)
function createAdmin({ email, password, nom, role }) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(`
    INSERT INTO admins (email, mot_de_passe, nom, role)
    VALUES (?, ?, ?, ?)
  `);

  const info = stmt.run(email, hashedPassword, nom || null, role || "admin");

  return {
    id: info.lastInsertRowid,
    email,
    nom: nom || null,
    role: role || "admin",
  };
}

// Trouver un admin par email
function findByEmail(email) {
  const stmt = db.prepare(`
    SELECT
      id,
      email,
      mot_de_passe AS motDePasse,
      nom,
      role,
      date_creation AS dateCreation
    FROM admins
    WHERE email = ?
  `);

  return stmt.get(email) || null;
}

// Vérifier un mot de passe (compare texte vs hash)
function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  createAdmin,
  findByEmail,
  verifyPassword,
};
