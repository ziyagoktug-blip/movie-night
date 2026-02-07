const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const filePath = path.join(__dirname, 'films.json');

// Filmleri getir
app.get('/api/films', (req, res) => {
  const data = readFilms();
  res.json(data);
});

// Film ekle
app.post('/api/films', (req, res) => {
  const films = readFilms();
  const newFilm = { id: Date.now(), ...req.body };
  films.push(newFilm);
  writeFilms(films);
  res.json(newFilm);
});

// Film sil
app.delete("/api/films/:id", (req, res) => {
    const filmId = Number(req.params.id);
    const films = readFilms();
    const filteredFilms = films.filter(f => f.id !== filmId);
    writeFilms(filteredFilms);
    res.json({ success: true });
});

function readFilms() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeFilms(films) {
  fs.writeFileSync(filePath, JSON.stringify(films, null, 2));
}

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
