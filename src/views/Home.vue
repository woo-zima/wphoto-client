<template>
  <div class="Home">
    <WaterFall
      :picList="state.picList"
      @nextPage="nextPage"
      class="photoVirualList"
      column="4"
      @resetWindow="resetWindow"
    ></WaterFall>
  </div>
</template>

<script setup>
import { inject, nextTick, watch, onMounted, reactive, ref } from 'vue';

const state = reactive({
  picList: [],
});
const photoVirual = ref();
const $api = inject('$api');
// onBeforeMount(() => {
//   window.addEventListener('resize', resetWindow, false);
// });
onMounted(() => {
  // window.addEventListener('resize', resetWindow, false);
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
  console.log(e);
  let rect = e.getBoundingClientRect();
  // photoVirual.style
  console.log(rect.width);
  if (rect.width >= 1200) {
    state.column = 4;
  } else if (rect.width >= 900) {
    state.column = 3;
  } else {
    state.column = 2;
  }
};
</script>

<style></style>
