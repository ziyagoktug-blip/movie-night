let selectedFilmId = null;

async function loadFilms() {
  const res = await fetch('/api/films');
  const films = await res.json();

  const container = document.getElementById("container");
  container.innerHTML = '';

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

function openModal(id, film) {
  selectedFilmId = id;
  document.getElementById("modalTitle").innerText = film.title;
  document.getElementById("modalText").innerText = film.plot;
  document.getElementById("modal").style.display = "flex";
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
  document.getElementById("modal").style.display = "none";
  document.body.classList.remove("modal-open");
}


const modal = document.getElementById("modal");
modal.addEventListener("click", (e) => { if(e.target===modal) closeModal(); });

loadFilms();
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

function selectFilm(filmId) {
  fetch('/api/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filmId })
  });

  popcornExplosion();
}
