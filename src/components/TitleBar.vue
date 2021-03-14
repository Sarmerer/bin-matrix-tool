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
import { bus } from "@/event-bus";

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
            { name: "Add row", hotkey: "Ctrl+A", event: "add-row" },
            { splitter: true },
            {
              name: "Clear all cells",
              hotkey: "Ctrl+Alt+C",
              event: "clear-all",
            },
            { name: "Delete all rows", hotkey: "Ctrl+D", event: "delete-all" },
            { splitter: true },
            { name: "Preferences", options: [{ name: "Open settings file" }] },
          ],
        },
        {
          name: "Window",
          options: [
            { name: "Always on top", hotkey: "Ctrl+P", event: "pin-to-top" },
            { name: "Maximize", event: "maximize" },
            { name: "Minimize", event: "minimize" },
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
                  hotkey: "Ctrl+1",
                  event: "change-layout",
                  eventArgs: ["default"],
                },
                {
                  name: "Columns",
                  hotkey: "Ctrl+2",
                  event: "change-layout",
                  eventArgs: ["stack"],
                },
                {
                  name: "Stack",
                  hotkey: "Ctrl+3",
                  event: "change-layout",
                  eventArgs: ["sequence"],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    bus.$on("maximize", () => this.maximize());
    bus.$on("minimize", () => this.minimize());
    bus.$on("pin-to-top", () => this.setAlwaysOnTop());
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
