<template>
  <div class="Liked">
    <WaterFall
      :picList="state.picList"
      @nextPage="nextPage"
      class="photoVirualList"
      :column="resetWindow()"
      @resetColumn="resetColumn"
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

const resetColumn = number => {
  resetWindow();
};
const resetWindow = () => {
  let { clientWidth } = document.scrollingElement;
  if (clientWidth >= 1200) {
    state.column = 4;
    return state.column;
  } else if (clientWidth >= 890) {
    state.column = 3;
    return state.column;
  } else {
    state.column = 2;
    return state.column;
  }
};
</script>

<style scoped>
.nullLike {
  text-align: center;
}
</style>
