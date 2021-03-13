<template>
  <div>
    <div
      class="fixed top-0 right-0 cursor-pointer"
      style="-webkit-app-region: no-drag;"
    >
      <button class="w-6 h6" @click="setAlwaysOnTop">
        <img v-if="!isOnTop" src="@/assets/icons/push_pin.svg" alt="." />
        <img v-else src="@/assets/icons/push_pin_fill.svg" alt="." />
      </button>
      <button class="w-6" @click="minimize">
        <img src="@/assets/icons/dash.svg" alt="-" />
      </button>
      <button class="w-6" @click="maximize">
        <img src="@/assets/icons/square.svg" alt="+" />
      </button>
      <button class="w-6" @click="close">
        <img src="@/assets/icons/clear.svg" alt="x" />
      </button>
    </div>
  </div>
</template>
<script>
const win = require("@electron/remote").getCurrentWindow();

export default {
  name: "TitleBar",
  data() {
    return { isOnTop: win.isAlwaysOnTop() };
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
      win.isMaximized() ? win.unmaximize() : win.maximize();
    },
    close() {
      win.close();
    },
  },
};
</script>
<style scoped>
/*#title {
  position: fixed;
  top: 0;
  left: 0;
}

#app-control-buttons {
  -webkit-app-region: no-drag;
  position: fixed;
  top: 0;
  left: 0;
}

#app-control-buttons > button {
  outline: none;
  border: none;
  height: 1.5rem;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  color: rgba(255, 255, 255, 0.7);
  background-color: #202225;
}

#app-control-buttons > button:hover {
  background-color: #383b41;
}

#window-control-buttons {
  -webkit-app-region: no-drag;
  position: fixed;
  top: 0;
  right: 0;
  height: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

#window-control-buttons > button {
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

#window-control-buttons > button:not(#close-button):hover {
  background-color: var(--body-bg-clr);
}

#close-button:hover {
  background-color: #f04747;
} */
</style>
