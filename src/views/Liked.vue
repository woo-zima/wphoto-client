<template>
  <div class="liked">
    <WaterFall
      :picList="state.picList"
      :column="state.column"
      @nextPage="nextPage"
      class="photoVirualList"
      ref="photoVirual"
    ></WaterFall>
  </div>
  <div v-if="state.picList == ''" class="nullLike">
    <span class="nullLikeTitle">{{ state.nullLike }}</span>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import { loginStore } from '@/store';

const photoVirual = ref();
const store = loginStore();
const $api = inject('$api');
const state = reactive({
  picList: [],
  column: 4,
  nullLike: '暂无收藏QAQ',
});

onMounted(() => {
  nextPage(1);
});
const nextPage = async pageNum => {
  let uid = store.userDeail.uid;
  const res = await $api.like.getLikesByUid(uid, pageNum);
  if (res) {
    let photoMsg = res.data.map(item => {
      return item.photoMsg;
    });
    state.picList.push(...photoMsg);
  }
};
</script>

<style scoped>
.liked {
  height: calc(100vh - 120px);
  /* overflow-y: scroll; */
  width: 100%;
  display: flex;
  justify-content: center;
}

.photoVirualList {
  position: relative;
  width: 1200px;
  margin: 0 auto;
  overflow-y: scroll;
}
.nullLike {
  text-align: center;
}
</style>
