<template>
  <ul class="menu">
    <li
      class="item"
      :class="{ 'item-hover': openedID === index }"
      v-for="(item, index) in localItems"
      :key="index"
      @click="open(index)"
      @mouseover="open(index, true)"
      @mouseleave="close()"
      v-on-clickaway="close()"
    >
      {{ item.name }}
      <ul class="options" v-show="openedID === index">
        <dropdown-menu-option
          v-for="(option, index) in item.options"
          :key="index"
          :option="option"
        ></dropdown-menu-option>
      </ul>
    </li>
  </ul>
</template>
<script>
import DropdownMenuOption from "@/components/DropdownMenuOption";
import { mixin as clickaway } from "vue-clickaway2";
import { bus, events } from "@/event-bus";

export default {
  name: "DropdownMenu",
  props: {
    items: Array,
  },
  mixins: [clickaway],
  components: { DropdownMenuOption },
  data() {
    return { localItems: Object.assign({}, this.items), openedID: -1 };
  },
  created() {
    bus.$on(
      events.windowCloseToolbarMenu.eventName,
      () => (this.openedID = -1)
    );
  },
  methods: {
    open(index, isHover) {
      if (!isHover) {
        this.openedID = index;
        this.oneOpened = true;
      }
      if (isHover && this.openedID !== -1) {
        return (this.openedID = index);
      }
    },
    close() {
      return function() {
        if (this.openedID === -1) return;
        this.openedID = -1;
      };
    },
  },
};
</script>
<style scoped>
.menu {
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 1.5rem;
  display: flex;

  font-size: 0.9rem;
}

.item {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  width: min-content;
  position: relative;
  margin: 0;
  padding: 0.1rem 0.5rem;
}

.item-hover {
  background-color: #383b41;
}

.item:hover {
  background-color: #383b41;
}

.options {
  left: 0;
  padding: 0.4rem 0;
  text-align: start;
  position: absolute;
  list-style-type: none;
  width: max-content;
  background-color: var(--context-menu-bg-clr);
  box-shadow: 2px 2px 2px 0px #202020;
}
</style>
