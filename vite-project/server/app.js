// server/app.js
const express = require("express");
const cors = require("cors");
const licencieRoutes = require("./routes/licencieRoutes");
const authRoutes = require("./routes/authRoutes"); // <-- AJOUT
const matchRoutes = require("./routes/matchRoutes");
const evenementRoutes = require("./routes/evenementRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/licencies", licencieRoutes);
app.use("/api/auth", authRoutes); // <-- AJOUT
app.use("/api/matchs", matchRoutes);
app.use("/api/evenements", evenementRoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("API DOGZ Admin en ligne 🐺");
});

module.exports = app;
