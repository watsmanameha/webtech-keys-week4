const express = require('express');
const multer = require('multer');

const app = express();

const LOGIN = "edzhulaj";

app.get('/login', (req, res) => {
    res.type('text/plain').send(LOGIN);
});

app.get('/hour', (req, res) => {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const moscowHour = (utcHour + 3) % 24; // Москва = UTC+3
  const hh = String(moscowHour).padStart(2, '0');
  res.type('text/plain').send(hh);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});