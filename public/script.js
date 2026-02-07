async function loadFilms() {
  const res = await fetch('/api/films');
  const films = await res.json();

  const container = document.getElementById("container");
  container.innerHTML = '';

  films.forEach(film => {
    const poster = document.createElement("div");
    poster.className = "poster";
    poster.style.backgroundImage = `url('${film.poster}')`;
    poster.onclick = () => openModal(film);
    container.appendChild(poster);
  });
}

function openModal(film) {
  document.getElementById("modalTitle").innerText = film.title;
  document.getElementById("modalText").innerText = film.plot;
  document.getElementById("modal").style.display = "flex";

  document.getElementById("selectBtn").onclick = async () => {
    await fetch('/api/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filmId: film.id })
    });
    closeModal();
    loadResult();
  };

  document.getElementById("trailerBtn").onclick = () => {
    window.open(film.trailer, "_blank");
  };
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

async function loadResult() {
  const state = await fetch('/api/state').then(r => r.json());
  if (!state.selectedFilmId) return;

  const films = await fetch('/api/films').then(r => r.json());
  const film = films.find(f => f.id === state.selectedFilmId);
  if (!film) return;

  document.getElementById("container").style.display = "none";
  document.getElementById("finalText").innerHTML = `
    🎬 <b>${film.title}</b><br>
    📅 ${state.watchDate || "Tarih belirlenmedi"}
  `;
  document.getElementById("final").classList.add("show");
  document.getElementById("resetBtn").onclick = async () => {
  await fetch('/api/reset', { method: 'POST' });

  document.getElementById("final").classList.remove("show");
  document.getElementById("container").style.display = "flex";

  loadFilms();
};

}

loadFilms();
loadResult();
