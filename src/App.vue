<template>
  <div id="app">
    <div id="title-bar">
      <div id="title">My Life For The Code</div>
      <div id="title-bar-btns">
        <button id="min-btn" @click="minimize">-</button>
        <button id="max-btn" @click="maximize">+</button>
        <button id="close-btn" @click="close">x</button>
      </div>
    </div>
    <bit-array></bit-array>
  </div>
</template>

<script>
import BitArray from "@/components/BitArray";
const remote = require("@electron/remote");

export default {
  name: "App",
  components: {
    BitArray,
  },

  methods: {
    minimize() {
      remote.getCurrentWindow().minimize();
    },
    maximize() {
      console.log(remote.getCurrentWindow().isMaximized());
      remote.getCurrentWindow().isMaximized()
        ? remote.getCurrentWindow().unmaximize()
        : remote.getCurrentWindow().maximize();
    },
    close() {
      remote.getCurrentWindow().close();
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

:root {
  --bg-color: #18191a;
  --primary: #18191a;
  --secondary: #242526;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: rgba(255, 255, 255, 0.87);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  text-align: center;
}

#title-bar {
  -webkit-app-region: drag;
  height: 24px;
  background-color: darkviolet;
  padding: none;
  margin: 0px;
}

#title {
  position: fixed;
  top: 0px;
  left: 6px;
}

#title-bar-btns {
  -webkit-app-region: no-drag;
  position: fixed;
  top: 0px;
  right: 6px;
}
</style>
