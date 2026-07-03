// Información del proyecto y las emociones

const ICON_CLOSE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Siempre ve el lado bueno" },
  { key: "anger", name: "Furia", desc: "Directo y sin filtro" },
  { key: "anxiety", name: "Ansiedad", desc: "Siempre alerta, siempre lista" },
  { key: "sadness", name: "Tristeza", desc: "Empatía ante todo" },
];

function emotionCard({ key, name, desc }) {
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

export function renderAbout() {
  const app = document.getElementById("app");
  const cards = EMOTIONS.map(emotionCard).join("");

  app.innerHTML = `
    <div id="About">
      <nav class="about-nav">
        <p class="about-nav__brand">INTENSAMENTE</p>
        <a class="btn-about-close" href="/home" aria-label="Volver a home">
          ${ICON_CLOSE}
        </a>
      </nav>

      <div class="container-header">
        <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
        <p class="header__subtitle">Cada emoción tiene una forma distinta de ver el mismo momento.</p>
      </div>

      <section class="about-card">
        <h3>¿De qué trata este proyecto?</h3>
        <p>Este proyecto propone una experiencia de conversación inspirada en la película Intensamente.</p>
        <p>
          En lugar de hablar con una inteligencia artificial genérica, el usuario puede conversar
          con distintas emociones, cada una con una personalidad única.
        </p>
        <p>
          Cada personaje cuenta con un prompt diseñado especialmente para definir su forma de pensar,
          expresarse y reaccionar, permitiendo que una misma pregunta reciba respuestas completamente
          diferentes según la emoción elegida.
        </p>
      </section>

      <section class="about-section">
        <h3>Conocé las emociones</h3>
        <div class="container-cards container-cards--about">
          ${cards}
        </div>
      </section>

      <section class="about-section">
        <h3>Tecnologías</h3>
        <ul class="tech-list">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>Gemini AI</li>
          <li>Vercel</li>
        </ul>
      </section>

      <p class="about-quote">"No existen emociones buenas o malas. Son solo emociones."</p>

      <footer class="footer">
        <a>@candeferrari</a>
      </footer>
    </div>
  `;
}