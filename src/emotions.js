// Datos de las 4 emociones, centralizados en un solo lugar

export const EMOTIONS = {
  joy: {
    name: "Alegría",
    desc: "Encuentro un motivo para sonreír.",
    status: "En línea · lista para alegrarte el día",
    helps: ["Encontrar lo positivo", "Recuperar el ánimo", "Celebrar tus logros", "Motivarte"],
    greeting: "¡Hola! ✨ Me alegra muchísimo verte. ¿Qué hacemos hoy?",
    phrase: "Hasta los días grises esconden un rayito de sol. ☀️",
  },
  anger: {
    name: "Furia",
    desc: "A veces hace falta hacerse escuchar.",
    status: "En línea · sin vueltas",
    helps: ["Poner límites", "Expresar lo que sentís", "Resolver conflictos", "Defender tu postura"],
    greeting: "Bueno... decime qué pasó. 🔥",
    phrase: "Quedarse callado no siempre es la mejor opción.",
  },
  sadness: {
    name: "Tristeza",
    desc: "No hace falta estar bien todo el tiempo.",
    status: "En línea · acá para acompañarte",
    helps: ["Hablar de lo que sentís", "Encontrar contención", "Procesar emociones", "Tomarte un respiro"],
    greeting: "Hola... 💙 Estoy acá para escucharte.",
    phrase: "A veces, sentir también es una forma de avanzar.",
  },
  anxiety: {
    name: "Ansiedad",
    desc: "Imagino todos los escenarios posibles.",
    status: "En línea · pensando un paso adelante",
    helps: ["Organizar ideas", "Prepararte para desafíos", "Reducir la incertidumbre", "Ordenar tus pendientes"],
    greeting: "¡Esperá! 😰 Contame bien qué está pasando.",
    phrase: "Respiremos primero... después resolvemos lo demás.",
  },
};

// Orden en el que se muestran las tarjetas/dots.
export const EMOTION_ORDER = ["joy", "anger", "sadness", "anxiety"];