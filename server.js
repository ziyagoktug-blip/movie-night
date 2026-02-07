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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const STATE_FILE = path.join(__dirname, 'state.json');

// State oku
function readState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { selectedFilmId: null, watchDate: null };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
}

// State yaz
function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
app.post('/api/select', (req, res) => {
  const state = readState();
  state.selectedFilmId = req.body.filmId;
  writeState(state);
  res.json({ success: true });
});
app.post('/api/date', (req, res) => {
  const state = readState();
  state.watchDate = req.body.date;
  writeState(state);
  res.json({ success: true });
});
app.get('/api/state', (req, res) => {
  res.json(readState());
});
async function loadResult() {
  const state = await fetch('/api/state').then(r => r.json());
  if (!state.selectedFilmId) return;

  const films = await fetch('/api/films').then(r => r.json());
  const film = films.find(f => f.id === state.selectedFilmId);

  document.getElementById('container').style.display = 'none';

  document.getElementById('finalText').innerHTML = `
    🎬 <strong>${film.title}</strong><br><br>
    📅 <strong>${state.watchDate || "Tarih belirlenmedi"}</strong>
  `;

  document.getElementById('final').classList.add('show');
}

loadResult();
function selectFilm(e, filmId) {
  fetch('/api/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filmId })
  });

  popcornExplosion();
}
