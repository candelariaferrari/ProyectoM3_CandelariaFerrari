// Información del proyecto y las emociones

import { getTheme, toggleTheme } from "../theme.js";

const ICON_SUN = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

const ICON_MOON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Encuentro un motivo para sonreír." },
  { key: "anger", name: "Furia", desc: "A veces hace falta hacerse escuchar." },
  { key: "anxiety", name: "Ansiedad", desc: "Imagino todos los escenarios posibles." },
  { key: "sadness", name: "Tristeza", desc: "No hace falta estar bien todo el tiempo." },
];

// Arma el HTML de una tarjeta de emoción para la sección "Conocé las emociones".
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

// Pinta toda la vista de About y conecta el toggle de tema.
export function renderAbout() {
  const app = document.getElementById("app");
  const cards = EMOTIONS.map(emotionCard).join("");
  const theme = getTheme();

  app.innerHTML = `
    <div id="About" data-theme="${theme}">
       <nav class="container-navbar">
        <p class="header__movie">Intensamente</p>
        <span class="navbar__links">
          <a class="btn-about" href="/home">Home</a>
          <a class="btn-about" href="/chat">Chat</a>
          <a class="btn-about" href="/about">About</a>
          <button type="button" class="btn-theme" id="btnTheme" aria-label="Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}">
            ${theme === "light" ? ICON_MOON : ICON_SUN}
          </button>
        </span>
      </nav>
     
      <div class="container-header">
        <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
        <p class="header__subtitle">Cada emoción tiene una forma distinta de ver el mismo momento.</p>
      </div>

      <section class="about-card">
        <h3>¿De qué trata este proyecto?</h3>
        <p>Elegí inspirarme en <strong>Intensamente</strong> porque cada emoción tiene una personalidad muy marcada.</p>
        <p>Esto me permitió trabajar el diseño de prompts para que la inteligencia artificial no respondiera
         siempre igual, sino que reaccionara como lo haría cada personaje de la película. 
         También me ayudo a poder marcar bien el diseño de cada uno de ellos, pudiendo elegir una paleta de colores para cada
          uno y así generar una interfaz bien marcada. 
        </p>
        <p>
          El objetivo fue construir una experiencia donde el usuario realmente sienta que está conversando con las emociones de Riley y no simplemente con un asistente virtual.</p>
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

      <p class="about-quote">"Es curioso... hice la misma pregunta una y otra vez. 
      Lo único que cambió fue la emoción que decidió responder, tal vez ninguna sea buena o mala. Simplemente, son emociones. "</p>

      <footer class="footer">
       <span class="footer__links">
        <a class="link-footer" href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">Github</a>
        <a class="link-footer" href="https://www.linkedin.com/in/TU-USUARIO-AQUI" target="_blank" rel="noopener noreferrer">Linkedin</a>
      </span>
        <a href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">© 2026 - Creado por @candeferrari</a>
      </footer>
    </div>
  `;

  attachThemeToggle();
}

// Cambia el atributo data-theme directamente en el DOM. Los estilos claros.
function attachThemeToggle() {
  const aboutEl = document.getElementById("About");
  const btnTheme = document.getElementById("btnTheme");

  btnTheme?.addEventListener("click", () => {
    const newTheme = toggleTheme();
    aboutEl.setAttribute("data-theme", newTheme);
    btnTheme.innerHTML = newTheme === "light" ? ICON_MOON : ICON_SUN;
    btnTheme.setAttribute("aria-label", `Cambiar a modo ${newTheme === "light" ? "oscuro" : "claro"}`);
  });
}
