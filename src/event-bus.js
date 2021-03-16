import Vue from "vue";
import { settings } from "@/store/store";

export const bus = new Vue();

class ShortcutsManager {
  /**
   * @param {Event[]} shortcuts
   */
  constructor(shortcuts) {
    this.__shortcuts = {};

    for (const shortcut of shortcuts) {
      if (!shortcut.accelerator || !shortcut.eventName) continue;
      this.bindShortcut(shortcut);
    }
  }

  bindShortcut(shortcut) {
    if (this.conflict(shortcut)) return;
    this.__shortcuts[shortcut.accelerator] = {
      eventName: shortcut.eventName,
      args: shortcut.args || null,
      callback: shortcut.callback || null,
    };
  }

  conflict(shortcut) {
    if (this.__shortcuts[shortcut.accelerator]) {
      console.error(
        `Duplicated shortcuts bindings. Conflict: ${
          this.__shortcuts[shortcut.accelerator].eventName
        } (hotkey ${this.__shortcuts[shortcut.accelerator].hotkey}) and ${
          shortcut.eventName
        } (hotkey ${shortcut.accelerator})`
      );
      return true;
    }
  }

  getHotkey(accelerator) {
    return this.__shortcuts[accelerator];
  }
}

class Event {
  /**
   * @param {String} name name of an event, emitted to event bus when shortcut(accelerator) is triggered
   * @param {(String|Object)=} accelerator Is String: keys combination that triggers this event.
   * Is Object: keys - shortcuts that trigger event emittion, value - argument that is passed to emitted event on shortcut trigger
   * @param {Array=} args emitted with event name
   */
  constructor(name, accelerator, args) {
    let accel =
      settings?.keymap && settings.keymap[name]
        ? settings.keymap[name]
        : accelerator;
    this.__accelerator = accel;
    this.__eventName = name;
    this.__args = args || [];
  }

  get accelerator() {
    return this.__accelerator;
  }
  get eventName() {
    return this.__eventName;
  }
  get args() {
    return this.__args;
  }
  get callback() {
    return this.__callback;
  }
}

export const events = {
  editorAddRow: new Event("editor:add-row", "Ctrl+Shift+A"),
  editorClearAllRows: new Event("editor:clear-all-rows", "Ctrl+Shift+C"),
  editorDeleteLastRow: new Event("editor:delete-last-row", "Ctrl+Alt+D"),
  editorDeleteAllRows: new Event("editor:delete-all-rows", "Ctrl+Shift+D"),
  editorCopyResult: new Event("editor:copy-result", "Ctrl+C"),

  editorSetLayoutDefault: new Event("editor:set-layout-default", "Ctrl+1"),
  editorSetLayoutColumns: new Event("editor:set-layout-columns", "Ctrl+2"),
  editorSetLayoutStack: new Event("editor:set-layout-stack", "Ctrl+3"),

  windowPinToTop: new Event("window:pin-to-top", "Ctrl+P"),
  windowMinimize: new Event("window:minimize"),
  windowMaximize: new Event("window:maximize"),
  windowCloseToolbarMenu: new Event("window:close-toolbar-menu"),
  windowShowSettings: new Event("window:show-settings", "Ctrl+,"),
};

export const shortcutsManager = new ShortcutsManager(
  Object.entries(events).map((e) => e[1])
);

export function registerShortcuts() {
  window.addEventListener("keydown", (e) => {
    const event = shortcutsManager.getHotkey(getCombination(e));
    if (event) {
      return bus.$emit(event.eventName, event.args);
    }
  });
}

function getCombination(event) {
  let combination = [];

  if (event.ctrlKey && event.key !== "Control") combination.push("Ctrl");
  if (event.altKey && event.key !== "Alt") combination.push("Alt");
  if (event.shiftKey && event.key !== "Shift") combination.push("Shift");

  combination.push(event.key.charAt(0).toUpperCase() + event.key.slice(1));
  return combination.join("+");
}
