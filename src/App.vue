<template>
  <div id="app">
    <el-container class="page-container" style="overflow: hidden">
      <el-header>
        <HeaderBar />
      </el-header>
      <el-main class="window-view">
        <!-- vue-page-stack  -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <TopLogin />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
}
body {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}

a {
  text-decoration: none;
}
.el-popover.el-popper {
  min-width: 50px;
}
.Rank,
.Home,
.Liked {
  height: calc(100vh - 60px);
  /* overflow-y: scroll; */
  width: 100%;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
}
.el-main {
  --el-main-padding: 0;
}
.el-header {
  padding: 0;
}
</style>
