// server/controllers/adminController.js
const adminModel = require("../models/adminModel");

// GET /api/admins — liste tous les comptes admin
function getAllAdmins(req, res) {
  try {
    const admins = adminModel.getAllAdmins();
    return res.json(admins);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
}

// POST /api/admins — créer un nouveau compte admin
function createAdmin(req, res) {
  try {
    const { email, password, nom, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe obligatoires." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères." });
    }

    // Vérifier si l'email est déjà utilisé
    const existing = adminModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Un compte avec cet email existe déjà." });
    }

    const admin = adminModel.createAdmin({ email, password, nom, role });
    return res.status(201).json(admin);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
}

// DELETE /api/admins/:id — supprimer un compte admin
function deleteAdmin(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID invalide." });
    }

    // Empêcher de supprimer son propre compte
    if (id === req.admin.id) {
      return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte." });
    }

    const ok = adminModel.deleteAdmin(id);
    if (!ok) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
}

module.exports = { getAllAdmins, createAdmin, deleteAdmin };
