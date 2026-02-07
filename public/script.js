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
    selectFilm(film);
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

function selectFilm(film) {
  alert(`${film.title} seçildi!`);
}

const modal = document.getElementById("modal");
modal.addEventListener("click", (e) => { if(e.target===modal) closeModal(); });

loadFilms();
