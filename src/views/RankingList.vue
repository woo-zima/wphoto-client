<template>
  <div class="Rank">
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
  nextPage(1);
});
const nextPage = async pageNum => {
  const res = await $api.photo.getPhotoList(pageNum);
  if (res) {
    state.picList.push(...res.data);
    // console.log(state.picList);
  }
};
</script>

<style scoped></style>
