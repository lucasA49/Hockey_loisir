// server/app.js
const path = require("path");
// Charge server/.env quel que soit le dossier d'où le serveur est lancé
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const licencieRoutes = require("./routes/licencieRoutes");
const authRoutes = require("./routes/authRoutes");
const matchRoutes = require("./routes/matchRoutes");
const evenementRoutes = require("./routes/evenementRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ── Routes API ──
app.use("/api/licencies", licencieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matchs", matchRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/admins", adminRoutes);

// ── Servir le frontend React buildé (production) ──
const buildPath = path.join(__dirname, "../dist");
app.use(express.static(buildPath));
app.use((_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

module.exports = app;
