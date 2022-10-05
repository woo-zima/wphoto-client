<template>
  <div class="Means">
    <div class="leftBack">
      <button @click="toPath('up')" :class="route.name == 'Upl' ? 'hide' : ''">BACK</button>
    </div>
    <div class="rightContainer">
      <div class="authMsg">
        <div class="avatarImg">
          <el-avatar>{{ state.upMsg.uname }}</el-avatar>
        </div>
        <div class="msgMain">
          <h2>{{ state.upMsg.uname }}</h2>
          <div class="contact">
            <a @click="toPath('follow')">
              <p>关注数</p>
              <p>{{ state.followM.length }}</p>
            </a>
            <a @click="toPath('fans')">
              <p>粉丝数</p>
              <p>{{ state.fansM.length }}</p>
            </a>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const router = useRouter();
const state = reactive({
  upMsg: {},
  fansM: [],
  followM: [],
});

onMounted(() => {
  getUpMsg();
  getFsOrFl();
});
const getUpMsg = async () => {
  const res = await $api.user.getUpMsg(route.params.uid);
  if (res) {
    state.upMsg = res.data;
  }
};
watch(
  () => route.params,
  newVal => {
    console.log(newVal);
    if (newVal) return;
    getUpMsg();
    getFsOrFl();
  }
);

const getFsOrFl = async () => {
  let { uid } = route.params;
  Promise.all([$api.user.getFansMsg(uid), $api.user.getFollowMsg(uid)])
    .then(res => {
      // console.log(res);
      state.fansM = res[0].data;
      state.followM = res[1].data;
    })
    .catch(e => {
      // console.log(e);
      ElMessage({
        showClose: true,
        message: e,
        type: 'error',
      });
    });
};

const toPath = path => {
  router.push({
    path: `${path}`,
  });
};
</script>

<style scoped>
.Means {
  position: relative;
}
.Means .leftBack {
  position: absolute;
}
.leftBack .hide {
  display: none;
}
.Means .leftBack button {
  border: 1px solid #abc;
  background-color: #fff;
  padding: 5px 15px;
  margin-left: 15px;
  border-radius: 10px;
  cursor: pointer;
}
.Means .leftBack button:hover {
  border: 1px solid #eb5757;
}
.Means .rightContainer {
  padding-top: 10px;
}
.rightContainer .authMsg {
  margin-left: 3.3333vw;
  display: flex;
  gap: 25px;
}
.authMsg .avatarImg {
  padding: 30px;
}
.avatarImg .el-avatar {
  --el-avatar-size: 100px;
}
.authMsg .msgMain {
  flex: 4;
}
.contact {
  display: flex;
  gap: 12px;
}
.contact a {
  width: 50px;
  cursor: pointer;
}
.contact a:hover {
  color: #eb5757;
}
.contact a p {
  text-align: center;
}
</style>
