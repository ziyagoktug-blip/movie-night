const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const filmsPath = path.join(__dirname, 'films.json');
const statePath = path.join(__dirname, 'state.json');

function readJSON(file, def) {
  if (!fs.existsSync(file)) return def;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 🎬 Films
app.get('/api/films', (req, res) => {
  res.json(readJSON(filmsPath, []));
});

app.post('/api/films', (req, res) => {
  const films = readJSON(filmsPath, []);
  const film = { id: Date.now(), ...req.body };
  films.push(film);
  writeJSON(filmsPath, films);
  res.json(film);
});

app.delete('/api/films/:id', (req, res) => {
  const films = readJSON(filmsPath, []).filter(f => f.id !== Number(req.params.id));
  writeJSON(filmsPath, films);
  res.json({ success: true });
});

// 🧠 State
app.get('/api/state', (req, res) => {
  res.json(readJSON(statePath, { selectedFilmId: null, watchDate: null }));
});

app.post('/api/select', (req, res) => {
  const state = readJSON(statePath, { selectedFilmId: null, watchDate: null });
  state.selectedFilmId = req.body.filmId;
  writeJSON(statePath, state);
  res.json({ success: true });
});

app.post('/api/date', (req, res) => {
  const state = readJSON(statePath, { selectedFilmId: null, watchDate: null });
  state.watchDate = req.body.date;
  writeJSON(statePath, state);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
app.post('/api/reset', (req, res) => {
  writeJSON(statePath, {
    selectedFilmId: null,
    watchDate: null
  });
  res.json({ success: true });
});
