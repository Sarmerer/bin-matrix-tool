<template>
  <li
    :class="{ option: !option.splitter, parent: optionProps.options }"
    @mouseover="$set(optionProps, 'showSubmenu', true)"
    @mouseleave="$set(optionProps, 'showSubmenu', false)"
    @click.stop="optionProps.options ? null : callEvent()"
  >
    <template v-if="!option.splitter">
      <span class="action">
        {{ optionName }}
      </span>
      <span class="hotkey">
        {{ optionProps.hotkey }}
      </span>
      <span v-if="optionProps.options" class="icon">
        <img src="@/assets/icons/chervron-right.svg" alt=">"
      /></span>
      <ul
        class="submenu"
        v-if="optionProps.options"
        v-show="optionProps.showSubmenu"
      >
        <dropdown-menu-option
          v-for="(childOption, index) in optionProps.options"
          :key="index"
          :option="childOption"
        ></dropdown-menu-option>
      </ul>
    </template>

    <hr v-else class="splitter" />
  </li>
</template>
<script>
import { bus } from "@/event-bus";

export default {
  name: "DropdownMenuOption",
  props: {
    option: Object,
  },
  data() {
    return {
      optionName: this.option.name,
      optionProps: this.option,
    };
  },
  methods: {
    callEvent() {
      if (this.optionProps.event) {
        bus.$emit(this.optionProps.event, this.optionProps.eventArgs || null);
        bus.$emit("close-toolbar-menu");
      } else {
        console.log(`No event specified for "${this.optionName}" action`);
      }
    },
  },
};
</script>
<style>
.splitter {
  margin: 0.4rem auto;
  border: none;
  height: 1px;
  color: var(--hr-clr);
  background-color: var(--hr-clr);
  width: 90%;
  text-align: center;
}

.option {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1rem;

  height: 1.5rem;
  list-style-type: none;
  min-width: max-content;
  color: var(--text-secondary);
}

.option > span:not(.icon) {
  flex: 1 1 auto;
  padding: 0.3rem 0.6rem;
}

.option > .action {
  flex: 1 1 5rem;
  text-align: start;
}

.option > .hotkey {
  flex: 1 1 5rem;
  text-align: right;
}

.option > .icon {
  align-self: center;
}

.option:hover:not(.splitter) {
  background-color: var(--context-menu-item-hover-clr);
}

.parent {
  position: relative;
}

.submenu {
  box-shadow: 0px 0px 5px 0px #181818;
  background-color: var(--context-menu-bg-clr);
  min-width: max-content;
  position: absolute;
  padding: 0.4rem 0;
  top: -0.4rem;
  left: 100%;
}
</style>
