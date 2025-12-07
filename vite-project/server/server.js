// server/server.js
const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API DOGZ Admin en ligne sur le port ${PORT} 🐺`);
});
