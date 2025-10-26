const express = require('express');
const multer = require('multer');
const { PNG } = require('pngjs');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const LOGIN = 'edzhulaj';

// Маршрут /login — возвращаем логин
app.get('/login', (req, res) => {
  res.type('text/plain').send(LOGIN);
});

// Маршрут /size2json — ждем поле "image" в multipart/form-data (PNG)
app.put('/size2json', upload.single('image'), (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).type('application/json')
        .send(JSON.stringify({ error: 'No image field "image" provided' }));
    }

    const buffer = req.file.buffer;

    // Попытка прочитать PNG
    let png;
    try {
      png = PNG.sync.read(buffer);
    } catch (err) {
      return res.status(400).type('application/json')
        .send(JSON.stringify({ error: 'Invalid PNG image' }));
    }

    const result = { width: png.width, height: png.height };
    res.type('application/json').send(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.status(500).type('application/json').send(JSON.stringify({ error: 'Internal server error' }));
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${PORT}`);
});
