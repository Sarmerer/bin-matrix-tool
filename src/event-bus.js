import Vue from "vue";

export const bus = new Vue();

class Hotkey {
  constructor(accelerator, eventName, args, callback) {
    this.accelerator = accelerator;
    this.eventName = eventName;
    this.args = args || [];
    this.callback = callback;
  }
}

export function registerShortcuts() {
  window.addEventListener("keydown", (e) => {
    let hotkeys = [
      new Hotkey("Ctrl+A", "add-row"),
      new Hotkey("Ctrl+Alt+C", "clear-all"),
      new Hotkey("Ctrl+D", "delete-all"),
      new Hotkey("Ctrl+P", "pin-to-top"),

      new Hotkey("Ctrl+1", "change-layout", ["default"]),
      new Hotkey("Ctrl+2", "change-layout", ["stack"]),
      new Hotkey("Ctrl+3", "change-layout", ["sequence"]),
    ];
    for (const hotkey of hotkeys) {
      if (!hotkey.accelerator || !hotkey.eventName) continue;
      if (hotkey.accelerator === getCombination(e)) {
        return bus.$emit(hotkey.eventName, hotkey.args);
      }
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
