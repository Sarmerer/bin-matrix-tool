import fs from "fs";
import path from "path";
const settingsFilePath = "./src/store";
const settingsFileName = "settings.json";
const settingsFile = path.join(settingsFilePath, settingsFileName);

export default {
  settings: {},
  data: [],

  save(data) {
    localStorage.setItem("data", JSON.stringify(data));
  },
  load() {
    this.createSettingsFile();
    this.settings = this.loadSettings();
    this.data = JSON.parse(localStorage.getItem("data"));
    return this.data;
  },

  saveSettings() {},
  loadSettings() {
    if (!this.settingsFileExists()) {
      this.createSettingsFile();
    }
    return JSON.parse(fs.readFileSync(settingsFile).toString());
  },

  createSettingsFile() {
    fs.writeFileSync(settingsFile, JSON.stringify({}));
  },

  settingsFileExists() {
    return fs.access(settingsFile, (err) => err === null);
  },
};
