<template>
  <div class="Home">
    <WaterFall
      :picList="state.picList"
      @nextPage="nextPage"
      class="photoVirualList"
      :column="resetWindow()"
      @resetColumn="resetColumn"
    ></WaterFall>
  </div>
</template>

<script setup>
import { inject, nextTick, watch, onMounted, reactive, ref } from 'vue';

const state = reactive({
  picList: [],
  column: 0,
});
const photoVirual = ref();
const $api = inject('$api');

onMounted(() => {
  nextPage(1);
});
const nextPage = async pageNum => {
  const res = await $api.photo.getPhotoList(pageNum);
  if (res) {
    state.picList.push(...res.data);
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

<style></style>
