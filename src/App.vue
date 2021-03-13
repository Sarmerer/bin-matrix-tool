<template>
  <div
    id="app"
    class="font-sans text-white-800 flex-none flex-col overflow-hidden max-h-screen flex-wrap h-full"
  >
    <div id="titlebar" class="h-6 bg-blue-500"></div>
    <div id="main" class="h-auto bg-purple-500 overflow-y-auto h-full">
      <div class="w-1/2 h-full">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          placerat sodales nibh ac sodales. Nam varius iaculis facilisis. Mauris
          ac rhoncus ipsum. Proin consequat finibus augue eget sollicitudin.
        </p>
      </div>
    </div>
    <!-- <title-bar
      id="titlebar"
      class="cursor-move bg-gray-800"
      style="-webkit-app-region: drag;"
    ></title-bar>
    <bit-array id="main" class="overflow-y-auto"></bit-array> -->
  </div>
</template>

<script>
// import TitleBar from "@/components/TitleBar";
// import BitArray from "@/components/BitArray";

export default {
  name: "App",
  components: {
    // TitleBar,
    // BitArray,
  },
};
</script>
<style>
html,
body {
  height: 100%;
}
#titlebar {
  -webkit-user-drag: drag;
}

#main {
  -webkit-user-drag: drag;
  max-height: calc(100vh - 1.5rem);
}
/* @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

:root {
  --body-bg-clr: #282c34;
  --inputs-bg-clr: #353b45;
  --inputs-bg-secondary-clr: #282c34;
  --sidebar-bg-clr: #21252b;
  --context-menu-bg-clr: #3a3b3c;
  --context-menu-item-hover-clr: #545556;

  --hr-clr: #848585;

  --max-height: calc(100vh - 1.5rem);
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--body-bg-clr);
  color: #ffffffde;
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
}

#title-bar {
  -webkit-app-region: drag;
  height: 1.5rem;
  background-color: #202225;
  padding: none;
  margin: 0px;
  flex: none;
}

#main {
  height: var(--max-height);
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
} */

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
