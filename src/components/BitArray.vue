<template>
  <div>
    <context-menu ref="contextMenu" v-on:close-event="selectedComponent = null">
      <template #items>
        <h4
          class="header"
          v-text="selectedComponent ? selectedComponent.value : '0x00'"
        ></h4>
        <button class="item" @click="contextCopyHandler('hex')">
          Copy hex
        </button>
        <button class="item" @click="contextCopyHandler('bin')">
          Copy bin
        </button>
        <hr />
        <button
          class="item"
          @click="contextClearHandler"
          :disabled="selectedIsEmpty()"
        >
          Clear
        </button>
        <button class="item" @click="contextDeleteHandler">Delete</button>
      </template>
    </context-menu>
    <!-- <div class="header">
      <button @click="addConverters(Number.parseInt(addAmount) || 1)">
        Add
      </button>
      <input type="number" v-model="addAmount" />
      <button @click="clearAll">
        Clear
      </button>
      <button @click="deleteAll">
        Delete
      </button>
      <select v-model="layout">
        <option>default</option>
        <option>stack</option>
        <option>sequence</option>
      </select>
    </div> -->
    <div class="flex flex-wrap">
      <div class="flex-auto bg-blue-400">
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
              mr: !isRightAligned(component.id) && layout === 'default',
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
      <aside class="flex-2 bg-purple-400 max-w-1/5">
        <!-- <header>
          <button>o</button>
          <button>-</button>
          <button>x</button>
        </header> -->
        <div class="flex flex-wrap flex-row gap-1">
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
import store from "@/store/store";
import BitRow from "@/components/BitRow.vue";
import ContextMenu from "@/components/ContextMenu.vue";

export default {
  name: "BitArray",
  components: {
    ContextMenu,
    BitRow,
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.save);
    this.storeData = store.load();
    this.addConverters(this.storeData?.length || 1, this.storeData);
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
      this.components = [
        {
          id: 1,
          value: "0x00",
          hovered: false,
          component: BitRow,
        },
      ];
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
/* .container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
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
  max-height: var(--max-height);

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.table {
  width: fit-content;
  display: grid;
  padding: 0.5rem 0;
  background-color: var(--inputs-bg-clr);
  border-radius: 0.4rem;
  margin: 1rem 0;

}

.inputs .input-item {
  border-radius: 0.4rem;
  transition: box-shadow 0.1s linear;
}

.sidebar {
  flex: 1 1 20%;
  max-width: 30%;
  overflow-y: auto;
  max-height: var(--max-height);

  background-color:  var(--sidebar-bg-clr);
}

.sidebar > header {
  position: sticky;

  height: 1.5rem;
  background-color: var(--sidebar-bg-clr);
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
} */
</style>
