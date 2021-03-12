<template>
  <div id="app">
    <div id="title-bar">
      <div id="title">bit-matrix-tool</div>
      <div id="title-bar-buttons">
        <button id="pin-button" @click="setAlwaysOnTop">
          <img v-if="!isOnTop" src="@/assets/icons/push_pin.svg" alt="." />
          <img v-else src="@/assets/icons/push_pin_fill.svg" alt="." />
        </button>
        <button id="minimize-button" @click="minimize">
          <img src="@/assets/icons/dash.svg" alt="-" />
        </button>
        <button id="maximize-button" @click="maximize">
          <img src="@/assets/icons/square.svg" alt="+" />
        </button>
        <button id="close-button" @click="close">
          <img src="@/assets/icons/clear.svg" alt="x" />
        </button>
      </div>
    </div>
    <bit-array></bit-array>
  </div>
</template>

<script>
import BitArray from "@/components/BitArray";
const win = require("@electron/remote").getCurrentWindow();

export default {
  name: "App",
  components: {
    BitArray,
  },
  data() {
    return { isOnTop: false };
  },
  methods: {
    setAlwaysOnTop() {
      let value = !win.isAlwaysOnTop();
      this.isOnTop = value;
      win.setAlwaysOnTop(value);
    },
    minimize() {
      win.minimize();
    },
    maximize() {
      console.log(win.isMaximized());
      win.isMaximized() ? win.unmaximize() : win.maximize();
    },
    close() {
      win.close();
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

:root {
  --body-bg-clr: #282c34;
  --inputs-bg-clr: #353b45;
  --inputs-bg-secondary-clr: #282c34;
  --sidebar-bg-clr: #282c34;
  --context-menu-bg-clr: #3a3b3c;
  --context-menu-item-hover-clr: #545556;

  --hr-clr: #848585;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--body-bg-clr);
  color: #ffffffde;
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  text-align: center;
  overflow: hidden;
}

#title-bar {
  -webkit-app-region: drag;
  height: 1.5rem;
  background-color: #202225;
  padding: none;
  margin: 0px;
}

#title {
  position: fixed;
  top: 2px;
  left: 6px;
}

#title-bar-buttons {
  -webkit-app-region: no-drag;
  position: fixed;
  top: 0;
  right: 0;
  height: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

#title-bar-buttons > button {
  outline: none;
  border: none;
  height: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  color: rgba(255, 255, 255, 0.7);
  background-color: #202225;
}

#title-bar-buttons > button:not(#close-button):hover {
  background-color: var(--body-bg-clr);
}

#close-button:hover {
  background-color: #f04747;
}

::-webkit-scrollbar {
  width: 0.7rem;
}

::-webkit-scrollbar-track {
  background-color: #2e3338;
  border-radius: 0.5rem;
}

::-webkit-scrollbar-thumb {
  background-color: #202225;
  border-radius: 0.5rem;
}
</style>
