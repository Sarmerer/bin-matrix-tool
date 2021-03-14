<template>
  <div id="app">
    <title-bar id="title-bar"></title-bar>
    <bit-array id="main"></bit-array>
  </div>
</template>

<script>
import TitleBar from "@/components/TitleBar";
import BitArray from "@/components/BitArray";

export default {
  name: "App",
  components: {
    TitleBar,
    BitArray,
  },
  beforeDestroy() {
    window.removeEventListener("keydown");
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
  --context-menu-bg-clr: #353b45;
  --context-menu-item-hover-clr: #2c313a;

  --hr-clr: #6e6b74;

  --max-height: calc(100vh - 1.5rem);

  --text-primary: rgba(255, 255, 255, 0.6);
  --text-secondary: rgba(255, 255, 255, 0.87);
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--body-bg-clr);
  color: var(--text-primary);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /* display: grid; */
}

#title-bar {
  -webkit-app-region: drag;
  height: 1.5rem;
  background-color: #202225;
  padding: 0;
  margin: 0px;
  flex: none;
  user-select: none;
}

#main {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
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
