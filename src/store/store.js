import fs from "fs";
import path from "path";
const { app, shell } = require("@electron/remote");

const settingsFilePath =
  process.env.NODE_ENV === "development" ? "./" : app.getPath("userData");

const settingsFileName = "settings.json";
const settingsFile = path.join(settingsFilePath, settingsFileName);

let settings = loadSettings();
let storeData = loadData();

function saveStore(data) {
  localStorage.setItem("data", JSON.stringify(data));
  fs.writeFileSync(settingsFile, JSON.stringify(settings));
}

function loadData() {
  return JSON.parse(localStorage.getItem("data"));
}

function openSettingsFile() {
  shell.openPath(settingsFile);
}

function loadSettings() {
  if (!settingsFileExists()) {
    createSettingsFile();
  }
  return JSON.parse(fs.readFileSync(settingsFile));
}

function createSettingsFile() {
  fs.writeFileSync(
    settingsFile,
    JSON.stringify(
      {
        __WARNING:
          "Close the application before editing this file, or changes won't be saved",

        editor: {
          __COMMENT: "These are characters that will wrap the result string",
          __COMMENT1: "The value should have even length",
          __EXAMPLES: "{}, [], {{}}, foobar",
          wrapResultWith: "{}",
        },
        keymap: {
          __NOTE:
            "Shortcut keys should have the following order: Ctrl -> Alt -> Shift -> other keys, it won'r work otherwise",
          "editor:add-row": "Ctrl+Shift+A",
          "editor:clear-all-rows": "Ctrl+Shift+C",
          "editor:delete-all-rows": "Ctrl+Shift+D",
          "editor:delete-last-row": "Ctrl+Alt+D",
          "editor:set-layout-default": "Ctrl+1",
          "editor:set-layout-columns": "Ctrl+2",
          "editor:set-layout-stack": "Ctrl+3",
          "window:pin-to-top": "Ctrl+P",
        },
      },
      null,
      "\t"
    )
  );
}

function settingsFileExists() {
  try {
    fs.accessSync(settingsFile);
    return true;
  } catch {
    return false;
  }
}

export { settings, storeData, saveStore, openSettingsFile };
