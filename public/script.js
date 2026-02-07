let selectedFilmId = null;

const container = document.getElementById("container");
const final = document.getElementById("final");
const finalText = document.getElementById("finalText");
const modal = document.getElementById("modal");

/* ======================
   FILMLERI YUKLE
====================== */
async function loadFilms() {
  const res = await fetch('/api/films');
  const films = await res.json();

  container.innerHTML = '';
  container.style.display = 'flex';
  final.classList.remove('show');

  films.forEach(film => {
    const poster = document.createElement("div");
    poster.className = "poster";
    poster.style.backgroundImage = `url('${film.poster}')`;
    poster.setAttribute("data-title", film.title);

    poster.addEventListener("click", () => {
      openModal(film.id, film);
    });

    container.appendChild(poster);
  });
}

/* ======================
   MODAL
====================== */
function openModal(id, film) {
  selectedFilmId = id;
  document.getElementById("modalTitle").innerText = film.title;
  document.getElementById("modalText").innerText = film.plot;
  modal.style.display = "flex";
  document.body.classList.add("modal-open");

  document.getElementById("selectBtn").onclick = () => {
    closeModal();
    selectFilm(id);
  };

  document.getElementById("trailerBtn").onclick = () => {
    window.open(film.trailer, "_blank");
  };

  document.getElementById("backBtn").onclick = closeModal;
}

function closeModal() {
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

/* ======================
   SONUC YUKLE
====================== */
async function loadResult() {
  const stateRes = await fetch('/api/state');
  const state = await stateRes.json();

  // ❗ SECIM YOKSA → FILMLER KALIR
  if (!state || !state.selectedFilmId) {
    container.style.display = 'flex';
    final.classList.remove('show');
    return;
  }

  const films = await fetch('/api/films').then(r => r.json());
  const film = films.find(f => f.id === state.selectedFilmId);
  if (!film) return;

  container.style.display = 'none';

  finalText.innerHTML = `
    🎬 <strong>${film.title}</strong><br><br>
    📅 <strong>${state.watchDate || "Tarih belirlenmedi"}</strong>
  `;

  final.classList.add('show');
}

/* ======================
   FILM SEC
====================== */
async function selectFilm(filmId) {
  await fetch('/api/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filmId })
  });

  popcornExplosion();

  setTimeout(loadResult, 300);
}

/* ======================
   ILK ACILIS
====================== */
loadFilms();
loadResult();
