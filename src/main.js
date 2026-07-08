import { router } from "./router.js";
import { setupLinkInterception } from "./navigation.js";
import { applyBodyTheme } from "./theme.js";

applyBodyTheme(); //modo oscuro/claro
window.addEventListener("popstate", router); // usuario presiona atras/adelante
setupLinkInterception(); //navega sin recargar pagina
router(); //muestra la view segun el router
