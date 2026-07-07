// Vista de bienvenida: galería de emociones

const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Encuentro un motivo para sonreír." },
  { key: "anger", name: "Furia", desc: "A veces hace falta hacerse escuchar." },
  { key: "anxiety", name: "Ansiedad", desc: "Imagino todos los escenarios posibles." },
  { key: "sadness", name: "Tristeza", desc: "No hace falta estar bien todo el tiempo." },
];


// Arranca sin ninguna emoción seleccionada: el usuario tiene que elegir una tarjeta antes de poder chatear.
let selectedKey = null;

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

// El botón "Charlemos" arranca deshabilitado, se activa recién cuando se elige una tarjeta. 
function btnChatTemplate(key) {
  if (!key) {
    return `<a class="btn-chat btn-chat--disabled" id="btnChat" aria-disabled="true">Elegí una emoción para charlar</a>`;
  }
  return `<a class="btn-chat" id="btnChat" href="/chat/${key}">Charlemos</a>`;
}

export function renderHome() {
  const app = document.getElementById("app");
  const cards = EMOTIONS.map(cardTemplate).join("");

  app.innerHTML = `
    <div id="home">
      <nav class="container-navbar">
        <p class="header__movie">Intensamente</p>
        <span class="navbar__links">
          <a class="btn-about" href="/home">Home</a>
          <a class="btn-about" href="/chat">Chat</a>
          <a class="btn-about" href="/about">About</a>
        </span>
      </nav>
      <div class="container-header">
        <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
        <p class="header__subtitle">¿Con cuál querés hablar hoy?</p>
      </div>

      <div class="container-cards">
        ${cards}
      </div>

      ${btnChatTemplate(selectedKey)}

     <footer class="footer">
       <span class="footer__links">
        <a class="link-footer" href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">Github</a>
        <a class="link-footer" href="https://www.linkedin.com/in/TU-USUARIO-AQUI" target="_blank" rel="noopener noreferrer">Linkedin</a>
      </span>
        <a href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">© 2026 - Creado por @candeferrari</a>
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

      // Primer click: el botón pasa de deshabilitado a habilitado.
      btnChat.classList.remove("btn-chat--disabled");
      btnChat.removeAttribute("aria-disabled");
      btnChat.textContent = "Charlemos";
      btnChat.setAttribute("href", `/chat/${selectedKey}`);
    });
  });
}
