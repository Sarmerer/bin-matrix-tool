<template>
  <div>
    <context-menu ref="contextMenu" v-on:close-event="selectedComponent = null">
      <template #items>
        <h4
          class="context-menu-header"
          v-text="selectedComponent ? selectedComponent.value : '0x00'"
        ></h4>
        <button class="context-menu-item" @click="contextCopyHandler('hex')">
          Copy hex
        </button>
        <button class="context-menu-item" @click="contextCopyHandler('bin')">
          Copy bin
        </button>
        <hr />
        <button
          class="context-menu-item"
          @click="contextClearHandler"
          :disabled="selectedIsEmpty()"
        >
          Clear row
        </button>
        <button class="context-menu-item" @click="contextDeleteHandler">
          Delete row
        </button>
      </template>
    </context-menu>
    <div class="container">
      <div class="inputs">
        <div
          class=" table"
          :style="{
            'grid-template-columns':
              layout !== 'default' && components.length > 1
                ? '50% 50%'
                : '100%',
            'grid-template-rows':
              layout === 'stack' ? gridRowsTemplate(components.length) : '',
            'grid-auto-flow': layout === 'stack' ? 'column' : 'row',
          }"
        >
          <component
            v-for="(component, index) in components"
            :key="`input#${component.id}#${component.value}`"
            class="input-item"
            :class="{
              'row-hover': component.hovered,
              mr:
                (!isRightAligned(component.id) && layout === 'default') ||
                components.length < 2,
              ml: isRightAligned(component.id) && layout === 'default',
            }"
            :index="component.id"
            :rightAligned="isRightAligned(component.id)"
            :value="component.value"
            v-on:value-change="updateValue(component, $event)"
            v-on:splice="deleteOne(index)"
            :ref="`input#${component.id}`"
            :is="component.component"
            @contextmenu.native.prevent="contextMenuHandler($event, component)"
          ></component>
        </div>
      </div>
      <aside class="sidebar">
        <div class="content">
          <div
            class="preview-item"
            :class="{
              dimmed:
                component.value === '0x00' && lastUpdated !== component.id,
            }"
            v-for="(component, index) in components"
            :key="`preview#${component.id}`"
          >
            <span
              v-text="component.value ? component.value : '00'"
              class="preview-item-content"
              :class="{
                highlighted: lastUpdated === component.id,
              }"
              @mouseover="component.hovered = true"
              @mouseleave="component.hovered = false"
              @click="highlight(component.id)"
            ></span>
            <span v-if="index < components.length - 1">, </span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<script>
import BitRow from "@/components/BitRow.vue";
import store from "@/store/store";
import ContextMenu from "@/components/ContextMenu.vue";
import { bus } from "@/event-bus";

export default {
  name: "BitArray",
  components: {
    ContextMenu,
    BitRow,
  },
  data() {
    return {
      addAmount: 0,
      storeData: null,
      layout: "default",
      components: [],
      selectedComponent: null,
      lastUpdated: 0,
    };
  },
  created() {
    this.storeData = store.load();
    this.addConverters(this.storeData?.length || 1, this.storeData);

    window.addEventListener("beforeunload", this.save);
    bus.$on("add-row", (args) =>
      this.addConverters(args && args[0] ? args[0] : 1)
    );
    bus.$on("clear-all", () => this.clearAll());
    bus.$on("delete-all", () => this.deleteAll());

    bus.$on(
      "change-layout",
      (args) => (this.layout = args && args[0] ? args[0] : "default")
    );
  },
  methods: {
    addConverters(amount, values) {
      if (!amount) amount = 1;
      for (let i = 0; i < amount; i++) {
        let lastID = this.components.length
          ? this.components[this.components.length - 1].id
          : 0;

        let id = lastID + 1;
        let value = values && values[i] ? values[i] : "0x00";

        let component = {
          id: id,
          value: value,
          hovered: false,
          component: BitRow,
        };
        this.components.push(component);
      }
      this.addAmount = 0;
    },
    deleteOne(index) {
      this.$delete(this.components, index);
    },
    updateValue(component, newValue) {
      component.value = newValue;
      this.lastUpdated = component.id;
    },
    clearAll() {
      this.components.forEach((c) => (c.value = "0x00"));
    },
    deleteAll() {
      this.components = [];
      let amount = this.layout === "default" ? 1 : 2;
      this.addConverters(amount);
    },
    save() {
      let saveData = this.components.map((c) => c.value);
      store.save(saveData);
      window.removeEventListener("beforeunload", this.save);
    },

    contextMenuHandler(event, clickedComponent) {
      this.selectedComponent = clickedComponent;
      this.$refs?.contextMenu?.open(event);
    },
    contextCopyHandler(base) {
      switch (base) {
        case "bin":
          this.$copyText(
            Number.parseInt(this.selectedComponent?.value || "0x00", 16)
              .toString(2)
              .padStart(8, "0") || "00000000"
          );
          break;
        default:
          this.$copyText(this.selectedComponent?.value || "0x00");
          break;
      }
    },
    contextClearHandler() {
      this.selectedComponent.value = "0";
    },
    contextDeleteHandler() {
      this.$delete(
        this.components,
        this.components.map((c) => c.id).indexOf(this.selectedComponent.id)
      );
      for (let i = 0; i < this.components.length; i++) {
        this.components[i].id = i + 1;
      }
    },
    gridRowsTemplate(n) {
      return new Array(Math.ceil(n * 0.5)).fill("auto").join(" ");
    },
    isRightAligned(id) {
      if (this.layout === "stack") {
        let median = Math.ceil(this.components.length / 2);
        return id > median;
      } else if (this.layout === "sequence") {
        return id % 2 == false;
      }
    },
    selectedIsEmpty() {
      return this.selectedComponent?.value != 0 ? false : true;
    },
    highlight(id) {
      const el = this.$refs[`input#${id}`][0]?.$el;
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  width: 100%;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.header {
  height: 1.5rem;
  box-shadow: 1px 1px 1px #202020;
  position: relative;
}

.inputs {
  flex: 1 1 auto;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
  height: fit-content;
  max-height: var(--max-height);
}

.table {
  width: fit-content;
  display: grid;
  padding: 0.5rem 0;
  background-color: var(--inputs-bg-clr);
  border-radius: 0.4rem;
  margin: 1rem 0;
  /* box-shadow: 0.1rem 0.1rem 0.2rem 0px black; */
}

.inputs .input-item {
  border-radius: 0.4rem;
  transition: box-shadow 0.1s linear;
}

.sidebar {
  flex: 1 1 20%;
  max-width: 30%;
  overflow-y: auto;
  height: var(--max-height);

  background-color: #21252b; /* var(--sidebar-bg-clr) */
}

.sidebar > header {
  position: sticky;

  height: 1.5rem;
  background-color: var(--sidebar-bg-clr);
  /* box-shadow: 1px 1px 1px #202020; */
}

.sidebar > .content {
  overflow-y: auto;

  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.2rem;
  overflow: auto;
}

.sidebar .preview-item {
  color: var(--text-secondary);
  height: fit-content;
  width: fit-content;
  margin: 0;
}

.sidebar .preview-item > .preview-item-content {
  padding: 0 0.2rem;
  border-radius: 0.2rem;
  margin: 0;
}

.sidebar .preview-item-content:hover {
  background-color: #faed27;
  color: var(--body-bg-clr);
}

.sidebar .preview-item > .highlighted:not(:hover) {
  background-color: #ffa500;
  color: black;
}

.sidebar .preview-item.dimmed:not(:hover) {
  color: grey;
  opacity: 0.4;
}

.inputs .row-hover {
  box-shadow: inset 0 0 0 2px #faed27;
}
</style>
