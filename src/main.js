import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
// import { SortableJS } from "sortablejs";

import App from "./App.vue";
import router from "./router";
const app = createApp(App);
app.use(createPinia());
// app.use(SortableJS);
app.use(router);

app.mount("#app");
