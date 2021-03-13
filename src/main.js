import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "tailwindcss/tailwind.css";
import VueClipboard from "vue-clipboard2";

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
