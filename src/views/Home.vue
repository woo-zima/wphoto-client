<template>
  <div class="Home">
    <WaterFall
      :picList="state.picList"
      :column="state.column"
      @nextPage="nextPage"
      class="photoVirualList"
      ref="photoVirual"
    ></WaterFall>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';

const state = reactive({
  picList: [],
  column: 4,
});
const photoVirual = ref();
const $api = inject('$api');
onMounted(() => {
  state.column = resetWindow();
  console.log(state.column);
  window.addEventListener('resize', resetWindow, false);
  nextPage(1);
});
const nextPage = async pageNum => {
  const res = await $api.photo.getPhotoList(pageNum);
  if (res) {
    state.picList.push(...res.data);
    // console.log(state.picList);
  }
};
const resetWindow = e => {
  let elem = document.querySelector('.photoVirualList');
  let rect = elem.getBoundingClientRect();
  // photoVirual.style
  console.log(rect.width);
  if (rect.width > 1010) {
    state.column = 4;
    return 4;
  } else if (rect.width > 760) {
    state.column = 3;
    return 3;
  }
};
</script>

<style>
.Home {
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
</style>
