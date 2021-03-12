<template>
  <div>
    <span v-if="!rightAligned" class="row-index" v-text="index"></span>
    <input
      class="checkbox"
      :class="{
        'round-left': index === 0,
        'round-right': index === 7,
      }"
      v-for="(input, index) in binInput"
      :key="index"
      @mousedown.prevent="mouseover($event, input)"
      @mouseover="mouseover($event, input)"
      type="checkbox"
      v-model="input.value"
    />
    <span v-if="rightAligned" class="row-index" v-text="index"></span>
  </div>
</template>

<script>
export default {
  name: "BitRow",
  props: {
    index: { type: Number, default: 0, required: true },
    value: { type: String, default: "0" },
    rightAligned: { type: Boolean, default: false },
  },
  watch: {
    result: function(newValue) {
      this.$emit("value-change", newValue || "0");
    },
  },
  computed: {
    result() {
      let input = this.binInput.map((bi) => (bi.value ? "1" : "0")).join("");
      let hex = parseInt(input, 2)
        .toString(16)
        .toUpperCase();
      if (hex.length === 1) hex = `0${hex}`;
      return `0x${hex}`;
    },
  },
  beforeMount() {
    let bin = this.hexToBin(this.value);
    this.binInput.forEach((b, i) => (b.value = bin[i] == true));
  },
  data() {
    return {
      binInput: [
        { value: false },
        { value: false },
        { value: false },
        { value: false },
        { value: false },
        { value: false },
        { value: false },
        { value: false },
      ],
    };
  },
  methods: {
    hexToBin(n) {
      if (!this.isValidHex(n)) n = "0x00";
      return Number.parseInt(n, 16)
        .toString(2)
        .padStart(8, "0");
    },
    isValidHex(hex) {
      return typeof hex === "string" && !isNaN(Number.parseInt(`0x${hex}`, 16));
    },
    async mouseover(e, box) {
      if (e.which === 1) box.value = !e.altKey;
    },
  },
};
</script>
<style scoped>
.checkbox::before {
  content: "0";
  color: rgba(72, 72, 72, 0.625);
}

.checkbox:checked::before {
  content: "1";
  color: rgba(32, 32, 32, 0.857);
}

.checkbox {
  -webkit-appearance: none;
  background-color: var(--inputs-bg-secondary-clr);
  border: 1px solid transparent;
  padding: 0.4rem 0.7rem 0.4rem 0.7rem;
  margin: 2px;
  outline: none;
}

.checkbox:hover {
  border: #43b58284 solid 1px;
}

.checkbox:checked {
  background-color: #43b581;
}

.round-left {
  border-radius: 0.2rem 0 0 0.2rem;
}

.round-right {
  border-radius: 0 0.2rem 0.2rem 0;
}

.ml {
  margin-left: 0.5rem;
}

.mr {
  margin-right: 0.5rem;
}

.row-index {
  margin: 0;
  width: 1.5rem;
  display: inline-block;
}
</style>
