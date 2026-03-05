const people = [
  { nombre: "Juan Pérez", categoria: "Docente", ciudad: "Sede Central Medellín", correo: "juan.perez@upb.edu.co" },
  { nombre: "Laura Gómez", categoria: "Investigador", ciudad: "Seccional Bucaramanga", correo: "laura.gomez@upb.edu.co" },
  { nombre: "Carlos Rincón", categoria: "Administrativo", ciudad: "Seccional Montería", correo: "carlos.rincon@upb.edu.co" },
  { nombre: "Ana Martínez", categoria: "Docente", ciudad: "Seccional Palmira", correo: "ana.martinez@upb.edu.co" },
  { nombre: "Santiago Ruiz", categoria: "Docente", ciudad: "Seccional Bucaramanga", correo: "santiago.ruiz@upb.edu.co" }
];

const resultsEl = document.getElementById("results");
const counterEl = document.getElementById("counter");

const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnReset = document.getElementById("btnReset");

const subcatSelect = document.getElementById("subcatSelect");
const citySelect = document.getElementById("citySelect");

let selectedLetter = "";

/* ===== MODAL ===== */
const modal = document.getElementById("detailModal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");

const mNombre = document.getElementById("mNombre");
const mCiudad = document.getElementById("mCiudad");
const mCategoria = document.getElementById("mCategoria");
const mCorreo = document.getElementById("mCorreo");

function openModal(persona){
  mNombre.textContent = persona.nombre;
  mCiudad.textContent = persona.ciudad;
  mCategoria.textContent = persona.categoria;
  mCorreo.textContent = persona.correo;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if(e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeModal();
});

/* ===== RENDER ===== */
function render(list){
  resultsEl.innerHTML = "";
  counterEl.textContent = `Mostrando ${list.length} personas`;

  if(list.length === 0){
    resultsEl.innerHTML = `<p style="color:#6b7280;">No hay resultados.</p>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="img/user.jpg" alt="usuario">
      <div>
        <a class="name-link" href="#">${p.nombre}</a>
        <p><b>${p.ciudad.replace("Seccional ", "")}</b></p>
        <p><b>Título:</b> ${p.categoria}</p>
        <p>${p.correo}</p>
      </div>
    `;

    const link = card.querySelector(".name-link");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(p);
    });

    resultsEl.appendChild(card);
  });
}

/* ===== FILTROS ===== */
function applyFilters(){
  const text = (searchInput.value || "").trim().toLowerCase();
  const subcat = subcatSelect.value;
  const city = citySelect.value;

  const filtered = people.filter(p => {
    const okText = text === "" || p.nombre.toLowerCase().includes(text) || p.correo.toLowerCase().includes(text);
    const okSub = subcat === "Todas" || p.categoria === subcat;
    const okCity = city === "Todas las Seccionales" || p.ciudad === city;
    const okLetter = selectedLetter === "" || p.nombre.toUpperCase().startsWith(selectedLetter);
    return okText && okSub && okCity && okLetter;
  });

  render(filtered);
}

/* eventos */
btnSearch.addEventListener("click", applyFilters);
searchInput.addEventListener("input", applyFilters);
subcatSelect.addEventListener("change", applyFilters);
citySelect.addEventListener("change", applyFilters);

/* ✅ Buscar con ENTER */
searchInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") applyFilters();
});

/* ✅ A-Z activo */
document.querySelectorAll(".alphabet a").forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();

    selectedLetter = a.textContent.trim();

    // quitar activo a todos y activar solo el que se clickeó
    document.querySelectorAll(".alphabet a").forEach(x => x.classList.remove("active"));
    a.classList.add("active");

    applyFilters();
  });
});

btnReset.addEventListener("click", () => {
  searchInput.value = "";
  subcatSelect.value = "Todas";
  citySelect.value = "Todas las Seccionales";
  selectedLetter = "";

  // ✅ limpiar letra activa
  document.querySelectorAll(".alphabet a").forEach(x => x.classList.remove("active"));

  render(people);
});

/* init */
render(people);
