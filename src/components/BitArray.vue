<template>
  <div class="wrapper">
    <context-menu ref="contextMenu" v-on:close-event="selectedComponent = null">
      <template #items>
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
    <div class="header">
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
    </div>
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
            :class="{ 'row-hover': component.hovered }"
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
      <div class="sidebar">
        <div
          class="preview-item"
          v-for="component in components"
          :key="`preview#${component.id}`"
          @mouseover="component.hovered = true"
          @mouseleave="component.hovered = false"
          @click="highlight(component.id)"
        >
          {{ component.value ? `0x${component.value}` : "00" }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BitRow from "@/components/BitRow.vue";
import store from "@/store/store";
import ContextMenu from "@/components/ContextMenu.vue";

export default {
  name: "BitArray",
  components: {
    ContextMenu,
    BitRow,
  },
  computed: {
    sortedComponents() {
      let clone = [...this.components];
      let result;
      switch (this.layout) {
        case "default":
          result = this.defaultLayoutSort(clone);
          break;
        case "stack":
          result = this.stackLayoutSort(clone);
          break;
        case "sequence":
          result = this.defaultLayoutSort(clone);
          break;
      }
      return result;
    },
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.save);
    this.storeData = store.load();
    this.addConverters(this.storeData.length, this.storeData);
  },
  data() {
    return {
      addAmount: 0,
      storeData: null,
      layout: "default",
      components: [],
      selectedComponent: null,
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
        let value = values && values[i] ? values[i] : "0";

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
    },
    clearAll() {
      this.components.forEach((c) => (c.value = "0"));
    },
    deleteAll() {
      this.components = [
        {
          id: 1,
          value: "0",
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
      this.$refs.contextMenu.open(event);
    },
    contextCopyHandler() {
      this.$copyText(this.selectedComponent.value);
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
        let median = Math.ceil(this.components.length * 0.5);
        return id > median;
      } else if (this.layout === "sequence") {
        return id % 2 == false;
      }
    },
    selectedIsEmpty() {
      return this.selectedComponent && this.selectedComponent.value != 0
        ? false
        : true;
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
.wrapper {
  height: 100%;
}

.container {
  display: flex;
  flex-wrap: wrap;
}

.header {
  height: 1.5rem;
}

.inputs {
  flex: 1 1 auto;
  height: fit-content;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
  max-height: calc(100vh - 1.5rem);
}

.table {
  width: fit-content;
  display: grid;
  padding: 0.5rem 0.4rem 0.5rem 0.4rem;
  background-color: var(--secondary);
  border-radius: 0.4rem;
  box-shadow: 0.1rem 0.1rem 0.2rem 0px black;
}

.inputs .input-item {
  border-radius: 0.4rem;
  transition: box-shadow 0.1s linear;
}

.sidebar {
  flex: 1 1 20%;
  max-width: 20%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 1.5rem);
  background-color: var(--secondary);
}

.sidebar .preview-item {
  height: fit-content;
  width: fit-content;
  border-radius: 0.2rem;
  padding: 0.1rem;
  margin: 0;
}

.sidebar .preview-item:hover {
  background-color: #faed27;
  color: var(--bg-color);
}

.inputs .row-hover {
  box-shadow: inset 0 0 0 2px #faed27;
}
</style>
