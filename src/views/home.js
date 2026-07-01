const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Siempre ve el lado bueno" },
  { key: "anger", name: "Furia", desc: "Directo y sin filtro" },
  { key: "anxiety", name: "Ansiedad", desc: "Siempre alerta, siempre lista" },
  { key: "sadness", name: "Tristeza", desc: "Empatía ante todo" },
];

function cardTemplate({ key, name, desc }) {
  return `
      <div class="card ${key}" data-link href="/chat" data-emotion="${key}" tabindex="0" role="button">
        <img src="../../assets/img/${key}.png" alt="${name}" />
        <div class="card__info">
          <h3>${name}</h3>
          <p>${desc}</p>
        </div>
      </div>
    `;
}

export function renderHome() {
  const cards = EMOTIONS.map(cardTemplate).join("");

  return `
      <div id="home">
        <div class="container-header">
          <p class="header__movie">Intensamente</p>
          <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
          <p class="header__subtitle">¿Con cuál querés hablar hoy?</p>
        </div>
  
        <div class="container-cards">
          ${cards}
        </div>
  
        <button class="btn-chat" type="button" data-link href="/chat" data-emotion="joy">
          Charlemos
        </button>
  
        <footer class="footer">
          <a>@candeferrari</a>
          <button class="btn-about" type="button" data-link href="/about">About</button>
        </footer>
      </div>
    `;
}
