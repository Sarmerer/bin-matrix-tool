import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import VueClipboard from "vue-clipboard2";

import { registerShortcuts } from "@/event-bus";
registerShortcuts();

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
