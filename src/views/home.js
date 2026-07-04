// Vista de bienvenida: galería de emociones

const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Siempre encuentro un motivo para sonreír." },
  { key: "anger", name: "Furia", desc: "A veces hace falta hacerse escuchar." },
  { key: "anxiety", name: "Ansiedad", desc: "Siempre imagino todos los escenarios posibles." },
  { key: "sadness", name: "Tristeza", desc: "No hace falta estar bien todo el tiempo." },
];


let selectedKey = EMOTIONS[0].key;

function cardTemplate({ key, name, desc }) {
  const isActive = key === selectedKey;
  return `
    <button
      type="button"
      class="card ${key} ${isActive ? "active" : ""}"
      data-emotion="${key}"
      aria-pressed="${isActive}"
    >
      <div class="card__media">
        <img src="/assets/img/${key}.png" alt="${name}" />
      </div>
      <div class="card__info">
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
    </button>
  `;
}

export function renderHome() {
  const app = document.getElementById("app");
  const cards = EMOTIONS.map(cardTemplate).join("");

  app.innerHTML = `
    <div id="home">
      <div class="container-header">
        <p class="header__movie">Intensamente</p>
        <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
        <p class="header__subtitle">¿Con cuál querés hablar hoy?</p>
      </div>

      <div class="container-cards">
        ${cards}
      </div>

      <a class="btn-chat" id="btnChat" href="/chat/${selectedKey}">Charlemos</a>

      <footer class="footer">
        <a>@candeferrari</a>
        <a class="btn-about" href="/about">About</a>
      </footer>
    </div>
  `;

  attachCardSelection();
}

function attachCardSelection() {
  const cards = document.querySelectorAll(".container-cards .card");
  const btnChat = document.getElementById("btnChat");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedKey = card.dataset.emotion;

      cards.forEach((c) => {
        const isActive = c === card;
        c.classList.toggle("active", isActive);
        c.setAttribute("aria-pressed", String(isActive));
      });

      btnChat.setAttribute("href", `/chat/${selectedKey}`);
    });
  });
}
