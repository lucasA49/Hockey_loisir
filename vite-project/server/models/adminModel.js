// server/models/adminModel.js
const db = require("../db");
const bcrypt = require("bcryptjs");

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
    dateCreation: new Date().toISOString(),
  };
}

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

function getAllAdmins() {
  const stmt = db.prepare(`
    SELECT
      id,
      email,
      nom,
      role,
      date_creation AS dateCreation
    FROM admins
    ORDER BY date_creation ASC
  `);
  return stmt.all();
}

function deleteAdmin(id) {
  const stmt = db.prepare(`DELETE FROM admins WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  createAdmin,
  findByEmail,
  getAllAdmins,
  deleteAdmin,
  verifyPassword,
};
