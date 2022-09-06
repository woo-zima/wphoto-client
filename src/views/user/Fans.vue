<template>
  <div class="fans-main">
    <div class="fans-header">
      <p>{{ FansOrFoll(1) }}</p>
    </div>
    <div ref="Fcontent" class="fans-content">
      <div class="empty-fans" v-if="state.fsOrFl.length === 0">
        <p>{{ FansOrFoll(2) }}</p>
      </div>
      <div class="content-inner" v-else>
        <ul class="fs-list">
          <li class="fs-item" v-for="item in state.fsOrFl" :key="item.gzid">
            <a href="" class="cover">
              <el-avatar>{{ item.uMsg.uname }}</el-avatar>
            </a>
            <div class="content">
              <a href="">
                <span>{{ item.uMsg.uname }}</span>
              </a>
              <div class="footer">
                <div
                  class="fs-action"
                  @mouseover.stop="moveToDropDown"
                  @mouseleave.stop="leaveToDropDown"
                >
                  <span>已关注</span>
                  <ul class="action-dropdown-menu">
                    <li class="action-dropdown-item">取消关注</li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, inject, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { loginStore } from '@/store';

const $api = inject('$api');
const Fcontent = ref(null);
const store = loginStore();
const route = useRoute();
const state = reactive({
  fsOrFl: [],
});
onMounted(() => {
  getFsOrFl();
  console.log(Fcontent.value);
  console.log(Fcontent.value.querySelectorAll('.fs-action'));
});
const FansOrFoll = flag => {
  let loginUserId = store.userDeail.uid,
    currentUserId = route.params.uid;
  if (loginUserId == currentUserId) {
    if (route.name === 'Fans') {
      return flag === 1 ? '你的粉丝' : '你还没有粉丝哦';
    } else {
      return flag === 1 ? '你的关注' : '你还没有关注哦';
    }
  } else {
    if (route.name === 'Fans') {
      return flag === 1 ? 'Ta的粉丝' : 'Ta还没有粉丝哦';
    } else {
      return flag === 1 ? 'Ta的关注' : 'Ta还没有关注哦';
    }
  }
};

const getFsOrFl = async () => {
  let { uid } = route.params;
  if (route.name === 'Fans') {
    const res = await $api.user.getFansMsg(uid);
    if (res) {
      console.log(res);
      state.fsOrFl = res.data;
      console.log(state.fsOrFl);
    }
  }
  if (route.name === 'Follow') {
    const res = await $api.user.getFollowMsg(uid);
    if (res) {
      console.log(res);
      state.fsOrFl = res.data;
    }
  }
};
//鼠标移入显示drop
const moveToDropDown = e => {
  console.log(e);
};
//鼠标移出
const leaveToDropDown = e => {
  console.log(e);
};
</script>

<style scoped>
.fans-main {
  width: 850px;
  margin: 0 auto;
  min-height: 500px;
}

.fans-main .fans-header {
  margin: 20px 20px 0;
  border-bottom: 1px solid #e5e9ef;
}

.fans-content .content-inner {
  padding-bottom: 10px;
}

.content-inner .fs-list {
  padding: 0 20px 20px;
}

.fs-list .fs-item {
  display: block;
  padding: 15px 0;
  position: relative;
  line-height: 2;
  border-bottom: 1px solid #eee;
}
.fs-item .cover {
  background: url();
  background-size: cover;
  border-radius: 4px;
  display: block;
  float: left;
  overflow: hidden;
  position: relative;
}

.fs-item .content {
  padding: 0 200px 0 0;
  position: relative;
  margin-left: 20px;
  margin-top: 5px;
}
.content a {
  font-size: 16px;
  line-height: 19px;
}
.fs-item .content .footer {
  position: absolute;
  right: 0;
  top: 0;
}
.footer .fs-action {
  background-color: #e5e9ef;
  position: relative;
  border-radius: 4px;
  font-size: 0;
  color: #6d757a;
  padding: 4px 11px 4px 9px;
  line-height: 16px;
  border: 0;
  cursor: pointer;
}
.fs-action span {
  line-height: 16px;
  font-size: 12px;
  vertical-align: middle;
}

.fs-item .content a span {
  margin-left: 20px;
}

.action-dropdown-menu {
  position: fixed;
  top: 40px;
  z-index: 10;
  padding: 6px 0;
  background-color: #fff;
  border: 1px solid #e5e9ef;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 14%);
}
.action-dropdown-menu .action-dropdown-item {
  height: 30px;
  padding: 0 20px;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
  color: #222;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

@media (min-width: 1280px) {
  .fans-main {
    width: 1225px;
  }
}
</style>
