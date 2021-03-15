import fs from "fs";
import path from "path";
const { app } = require("@electron/remote");

const settingsFilePath = `${app.getAppPath()}/..`;
const settingsFileName = "settings.json";
const settingsFile = path.join(settingsFilePath, settingsFileName);

let settings = loadSettings();
let storeData = loadData();

function saveStore(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function loadData() {
  return JSON.parse(localStorage.getItem("data"));
}

function loadSettings() {
  console.log(settingsFile);
  if (!settingsFileExists()) {
    createSettingsFile();
  }
  return JSON.parse(fs.readFileSync(settingsFile));
}

function createSettingsFile() {
  fs.writeFileSync(settingsFile, JSON.stringify({ keymap: {} }));
}

function settingsFileExists() {
  try {
    fs.accessSync(settingsFile);
    return true;
  } catch {
    return false;
  }
}

export { settings, storeData, saveStore };
