<template>
  <div id="app">
    <bit-array></bit-array>
  </div>
</template>

<script>
import BitArray from "@/components/BitArray";

export default {
  name: "App",
  components: {
    BitArray,
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

:root {
  --bg-color: #18191a;
  --primary: #18191a;
  --secondary: #242526;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: rgba(255, 255, 255, 0.87);
  font-family: "Roboto", sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
