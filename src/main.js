import { router } from "./router.js";
import { setupLinkInterception } from "./navigation.js";
import { applyBodyTheme } from "./theme.js";

applyBodyTheme();
window.addEventListener("popstate", router);
setupLinkInterception();
router();
