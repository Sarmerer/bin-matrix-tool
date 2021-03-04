export default {
  data: [],

  save(saveData) {
    console.log(saveData);
    localStorage.setItem("data", JSON.stringify(saveData));
  },
  load() {
    this.data = JSON.parse(localStorage.getItem("data"));
    return this.data;
  },
};
