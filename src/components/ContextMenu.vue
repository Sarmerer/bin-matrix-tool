<template>
  <div
    ref="contextMenu"
    v-show="show"
    class="context-menu"
    :style="style"
    tabindex="0"
    v-on-clickaway="close"
    @click="close()"
  >
    <slot name="items" />
  </div>
</template>
<script>
import Vue from "vue";
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  computed: {
    style() {
      return { top: `${this.top}px`, left: `${this.left}px` };
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      show: false
    };
  },
  methods: {
    open(event) {
      let eventY = event.pageY || event.clientY;
      let eventX = event.pageX || event.clientX;
      let menuHeight = this.$refs?.contextMenu?.clientHeight || 170;
      let menuWidth = this.$refs?.contextMenu?.clientWidth || 0;
      let newY = eventY;
      let menuBottom = newY + menuHeight;

      let newX = eventX;
      let menuRight = newX + menuWidth;

      if (Math.max(menuBottom, window.innerHeight) === menuBottom) {
        newY -= menuHeight;
      }

      if (Math.max(menuRight, window.innerWidth * 0.5) === menuRight) {
        newX -= menuWidth;
      }

      this.top = newY;
      this.left = newX;

      Vue.nextTick(() => this.$el.focus());
      this.show = true;
    },
    close() {
      this.show = false;
      this.$emit("close-event");
      this.left = 0;
      this.top = 0;
    }
  }
};
</script>
<style scoped>
.context-menu {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  outline: none;

  position: absolute;
  z-index: 999;
  padding: 0.4rem 0;
  width: auto;
  height: auto;
  border-radius: 0.2rem;
  background-color: #3a3b3c;
}

.context-menu > .item {
  transition: background-color 0.2s linear;
  background-color: #3a3b3c;
  color: rgba(255, 255, 255, 0.87);
  text-align: start;
  padding: 0.6rem 3rem 0.4rem 0.5rem;
  margin: 0;
  border: none;
  outline: none;
}

.context-menu > .item:hover:enabled {
  background-color: #545556;
}

.context-menu > .item:disabled {
  opacity: 0.2;
}

.context-menu > .header {
  margin: 0;
  padding: 0;
}

hr {
  margin: 0 auto;
  width: 70%;
  border: none;
  height: 1px;
  background-color: var(--secondary);
  color: var(--secondary);
}
</style>
