<template>
  <div>
    <!-- <div id="title">
        <img src="@/assets/icons/logo.svg" alt="bit-matrix-tool" />
      </div> -->
    <div id="app-control-buttons">
      <dropdown-menu :items="dropdownItems"></dropdown-menu>
    </div>
    <div id="window-control-buttons">
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
</template>
<script>
import DropdownMenu from "@/components/DropdownMenu.vue";
const win = require("@electron/remote").getCurrentWindow();
import { bus, events } from "@/event-bus";

export default {
  components: { DropdownMenu },
  name: "TitleBar",
  data() {
    return {
      isOnTop: win.isAlwaysOnTop(),
      dropdownItems: [
        {
          name: "File",
          options: [
            {
              name: "Add row",
              event: events.editorAddRow,
            },
            {
              name: "Copy result",
              event: events.editorCopyResult,
            },
            { splitter: true },
            {
              name: "Clear all cells",
              event: events.editorClearAllRows,
            },
            {
              name: "Delete last row",
              event: events.editorDeleteLastRow,
            },
            {
              name: "Delete all rows",
              event: events.editorDeleteAllRows,
            },
            { splitter: true },
            { name: "Preferences", event: events.windowShowSettings },
          ],
        },
        {
          name: "Window",
          options: [
            {
              name: "Always on top",
              event: events.windowPinToTop,
            },
            { name: "Maximize", event: events.windowMaximize },
            { name: "Minimize", event: events.windowMinimize },
          ],
        },
        {
          name: "View",
          options: [
            {
              name: "Layout",
              options: [
                {
                  name: "Default",
                  event: events.editorSetLayoutDefault,
                },
                {
                  name: "Columns",
                  event: events.editorSetLayoutColumns,
                },
                {
                  name: "Stack",
                  event: events.editorSetLayoutStack,
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    bus.$on(events.windowMaximize.eventName, () => this.maximize());
    bus.$on(events.windowMinimize.eventName, () => this.minimize());
    bus.$on(events.windowPinToTop.eventName, () => this.setAlwaysOnTop());
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
  color: var(--text-primary);
}

#window-control-buttons > button {
  outline: none;
  border: none;
  height: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  background-color: #202225;
}

#window-control-buttons > button:not(#close-button):hover {
  background-color: var(--body-bg-clr);
}

#close-button:hover {
  background-color: #f04747;
}
</style>
