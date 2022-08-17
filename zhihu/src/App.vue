<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="Home">
      <component :is="Component"></component>
    </keep-alive>
    <div></div>
  </router-view>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="less">
html,
body {
  min-height: 100%;
  overflow-x: hidden;
  background: #f4f4f4;
  ;
}

#app {
  margin: 0 auto;
  background: #fff;
}
</style>