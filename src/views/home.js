// Vista de bienvenida: galería de emociones

const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Siempre ve el lado bueno" },
  { key: "anger", name: "Furia", desc: "Directo y sin filtro" },
  { key: "anxiety", name: "Ansiedad", desc: "Siempre alerta, siempre lista" },
  { key: "sadness", name: "Tristeza", desc: "Empatía ante todo" },
];

function cardTemplate({ key, name, desc }) {
  return `
    <a class="card ${key}" href="/chat/${key}">
      <div class="card__media">
        <img src="/assets/img/${key}.png" alt="${name}" />
      </div>
      <div class="card__info">
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
    </a>
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

      <a class="btn-chat" href="/chat/joy">Charlemos</a>

      <footer class="footer">
        <a>@candeferrari</a>
        <a class="btn-about" href="/about">About</a>
      </footer>
    </div>
  `;
}