<template>
  <div id="modal" v-show="shown">
    <div id="content" v-on-clickaway="close">
      <h4 id="header">Shortcuts</h4>
      <button @click="selectors++" :disabled="selectors >= events.length">
        add
      </button>
      <div id="selectors">
        <div v-for="index in selectors" :key="index" id="selector">
          <select>
            <option v-for="(option, index) in events" :key="index"
              >{{ option.name }}
            </option>
          </select>
          <input type="text" placeholder="shortcut" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway2";
import { bus, events } from "@/event-bus";

export default {
  name: "Modal",
  mixins: [clickaway],
  computed: {
    events() {
      return Object.entries(events)
        .filter(([, event]) => event.accelerator && !event.frozen)
        .map(([name, event]) => {
          return Object.assign({ name: name }, event);
        });
    },
  },
  data() {
    return {
      shown: false,
      selectors: 1,
    };
  },
  created() {
    bus.$on("window:open-settings-modal", () => (this.shown = true));
  },
  methods: {
    close() {
      this.shown = false;
    },
  },
};
</script>
<style scoped>
#modal {
  user-select: none;
  position: fixed;

  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

#content {
  background-color: var(--inputs-bg-clr);
  border-radius: 0.2rem;
  margin: 15% auto;
  padding: 1rem;
  width: fit-content;
  box-shadow: 1px 1px 2px 0 black;
  text-align: start;
}

#content > #header {
  padding: 0;
  margin: 0;
}

#content > #selectors {
  display: flex;
  flex-direction: column;
}
</style>
