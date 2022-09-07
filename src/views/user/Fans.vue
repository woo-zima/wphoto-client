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
                <div class="fs-action">
                  <el-popover v-model:visible="item.visible" trigger="hover" :width="80">
                    <div style="margin: 0; cursor: pointer; text-align: center">
                      <span size="small" @click="cancelFollow(item)">取消关注</span>
                    </div>
                    <template #reference>
                      <span class="followed" @click="toFollow(item)">
                        {{ item.followed ? '已关注' : '关注' }}
                      </span>
                    </template>
                  </el-popover>
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
const store = loginStore();
const route = useRoute();
const state = reactive({
  fsOrFl: [],
});
onMounted(() => {
  getFsOrFl();
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
  let { uid } = route.params,
    res;
  if (route.name === 'Fans') {
    res = await $api.user.getFansMsg(uid);
  }
  if (route.name === 'Follow') {
    res = await $api.user.getFollowMsg(uid);
  }
  if (res) {
    state.fsOrFl = res.data;
    state.fsOrFl.forEach(item => {
      item.visible = false;
      item.followed = true;
    });
  }
};
//取消关注
const cancelFollow = async item => {
  const res = await $api.user.cancelFollow(item.gzid);
  if (res.status === 200) {
    item.visible = false;
    item.followed = false;
    ElMessage({
      showClose: true,
      message: '取关成功QAQ',
      type: 'info',
    });
  } else {
    ElMessage({
      showClose: true,
      message: '出错辽QAQ',
      type: 'error',
    });
  }
};
//关注
const toFollow = async item => {
  if (!item.followed) {
    const res = await $api.user.addFollow(item.uid, item.followuid);
    if (res.status === 200) {
      item.followed = true;
      ElMessage({
        showClose: true,
        message: '关注成功W_W',
        type: 'success',
      });
    } else {
      ElMessage({
        showClose: true,
        message: '出错辽QAQ',
        type: 'error',
      });
    }
  } else {
    item.visible = !item.visible;
  }
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
  cursor: pointer;
}
.fs-action .followed {
  padding: 5px 7px;
  border: 1px solid #eee;
  border-radius: 5px;
}
.fs-action .followed:hover {
  border: 1px solid #eb5757;
}
.fs-action span {
  line-height: 16px;
  font-size: 12px;
  vertical-align: middle;
}

.fs-item .content a span {
  margin-left: 20px;
}
@media (min-width: 1280px) {
  .fans-main {
    width: 1225px;
  }
}
</style>
