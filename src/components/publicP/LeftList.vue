<template>
  <div class="LeftList">
    <el-menu
      mode="horizontal"
      :default-active="computerActiveNav()"
      class="el-menu-vertical-demo"
      router
    >
      <el-menu-item v-for="item of state.navLsit" :key="item.name" :index="item.routePath">
        <template>{{ item.name }}</template>
        {{ item.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isCollapse = ref(true);
const state = reactive({
  navLsit: [
    {
      name: '首页',
      icon: 'el-icon-s-home',
      routePath: '/',
    },
    {
      name: '排行',
      icon: 'el-icon-s-data',
      routePath: '/rank',
    },
    {
      name: '收藏',
      icon: 'el-icon-view',
      routePath: '/liked',
    },
    {
      name: '上传',
      icon: '',
      routePath: '/users/uploadphoto',
    },
  ],
});

const computerActiveNav = () => {
  let result = '0';
  const index = state.navLsit.indexOf(item => item.routePath === route.path);
  if (index !== -1) {
    result = `${index}`;
  }
  return result;
};
</script>

<style>
.LeftList .el-menu--horizontal {
  justify-content: center;
}

.el-menu--horizontal {
  border-bottom: none;
}

.el-menu-item.is-active {
  color: #eb5757 !important;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #eb5757;
  color: #eb5757 !important;
  background-color: #fff !important;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: #eb5757 !important;
  background-color: #fff !important;
}
</style>
