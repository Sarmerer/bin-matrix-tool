<template>
  <div>
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
    <div class="container">
      <div class="columns">
        <div class="column input">
          <div
            class="table"
            :style="{
              'grid-template-columns':
                layout !== 'default' ? '50% 50%' : '100%',
              'grid-template-rows':
                layout === 'stack' ? gridRowsTemplate(components.length) : '',
              'grid-auto-flow': layout === 'stack' ? 'column' : 'row',
            }"
          >
            <component
              v-for="(component, index) in components"
              :key="`${component.id}#${component.value}`"
              :index="component.id"
              :rightAligned="isRightAligned(component.id)"
              :value="component.value"
              v-on:value-change="updateValue(component, $event)"
              v-on:splice="deleteOne(index)"
              :is="component.component"
              @contextmenu.native.prevent="contextMenuHandler($event)"
            ></component>
          </div>
        </div>
        <div class="column preview">
          <p>{{ components.map((c) => `0x${c.value || "00"}`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BitRow from "@/components/BitRow.vue";
import store from "@/store/store";

export default {
  name: "BitArray",
  components: {
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
      this.components.forEach((c) => (c.value = 0));
    },
    deleteAll() {
      this.components = [];
    },
    save() {
      let saveData = this.components.map((c) => c.value);
      store.save(saveData);
      window.removeEventListener("beforeunload", this.save);
    },
    defaultLayoutSort(array) {
      return array.sort((a, b) => a.id - b.id);
    },
    stackLayoutSort(array) {
      let median = Math.ceil(array.length * 0.5);
      let firstHalf = array.filter((_, i) => i + 1 <= median);
      let secondHalf = array.filter((_, i) => i + 1 > median);
      let sorted = [];

      for (let i = 0; i < firstHalf.length; i++) {
        if (firstHalf[i]) sorted.push(firstHalf[i]);
        if (secondHalf[i]) sorted.push(secondHalf[i]);
      }

      return [...sorted];
    },
    contextMenuHandler() {},
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
  },
};
</script>
<style scoped>
.container {
  margin: 0 auto;
  width: 70%;
}

.columns {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.columns > .column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}

.columns > .input {
  align-items: flex-end;
  /* background-color: #1e1e1e; */
}

.table {
  display: grid;
  padding: 0.5rem 0.4rem 0.5rem 0.4rem;
  background-color: var(--secondary);
  border-radius: 0.4rem 0 0 0.4rem;
  box-shadow: 0.1rem 0.1rem 0.2rem 0px black;
}

.columns > .preview {
  align-items: flex-start;
  text-align: start;
}
</style>
