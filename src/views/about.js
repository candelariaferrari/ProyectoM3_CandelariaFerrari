// Información del proyecto y las emociones

import { getTheme } from "../theme.js";
import { navbarTemplate, footerTemplate, attachThemeToggle } from "./shared.js";
import { EMOTIONS, EMOTION_ORDER } from "../emotions.js";



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
  const cards = EMOTION_ORDER.map((key) => emotionCard({ key, ...EMOTIONS[key] })).join("");
  const theme = getTheme();

  app.innerHTML = `
    <div id="About" data-theme="${theme}">
      ${navbarTemplate(theme)}
     
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

     ${footerTemplate()}
    </div>
  `;

  attachThemeToggle("About"); //A mayus porque el id=About
}

