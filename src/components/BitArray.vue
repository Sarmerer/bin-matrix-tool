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
    <div class="container">
      <div class="columns">
        <div class="column input">
          <table class="table">
            <component
              v-for="(component, index) in components"
              :key="`${component.id}#${component.value}`"
              :value="component.value"
              v-on:value-change="updateValue(index, $event)"
              v-on:splice="deleteOne(index)"
              :is="component.component"
            ></component>
          </table>
        </div>
        <div class="column preview"></div>
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
  data() {
    return {
      addAmount: 0,
      storeData: null,
      components: [],
    };
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.save);
    this.storeData = store.load();
    this.addConverters(this.storeData.length, this.storeData);
  },
  methods: {
    addConverters(amount, values) {
      if (!amount) amount = 1;
      for (let i = 0; i < amount; i++) {
        let lastID = this.components.length
          ? this.components[this.components.length - 1].id
          : 0;

        let id = lastID + 1;
        let value = values && values[i] ? values[i] : 0;

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
    updateValue(index, newValue) {
      this.components[index].value = newValue;
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
  border-spacing: 0;
  padding: 0.5rem 0.4rem 0.5rem 0.4rem;
  background-color: var(--secondary);
  border-radius: 0.4rem 0 0 0.4rem;
  box-shadow: 0.1rem 0.1rem 0.2rem 0px black;
}

.columns > .preview {
  align-items: flex-start;
  /* background-color: #2b2b2b; */
}
</style>
