// server/test-db.js
const db = require("./db");

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

console.log("Tables dans dogz.db :", tables);
