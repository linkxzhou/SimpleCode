import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
// Locally bundled fonts (no CDN; same-origin under COEP)
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "./style.css";

createApp(App).use(createPinia()).mount("#app");
