import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { ensureCrossOriginIsolation } from "@/coi";
import { hydrateLocale } from "@/i18n";
// Locally bundled fonts (no CDN; same-origin under COEP)
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "./style.css";
import "./styles/docs.css";

await ensureCrossOriginIsolation();
hydrateLocale();
createApp(App).use(createPinia()).mount("#app");
