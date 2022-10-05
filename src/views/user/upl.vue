<template>
  <div class="upList">
    <div class="listTitle">上传作品</div>
    <ul class="listBox">
      <li class="boxItem" v-for="item in state.upLists">
        <img :src="'http://wphoto.top/' + item.purl" alt="" />
      </li>
    </ul>
    <div v-if="state.upLists == ''" class="nullP">暂无作品</div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const router = useRouter();
const state = reactive({
  upLists: [],
});
onMounted(() => {
  getUpLists();
});

watch(
  () => route.params,
  () => {
    getUpLists();
  }
);
const getUpLists = async () => {
  const query = { upid: route.params.uid };
  const res = await $api.photo.getUpPhotos(query);
  if (res) {
    state.upLists = res.data;
  }
};
</script>

<style scoped>
.upList {
  width: 100%;
}
.upList .listTitle {
  text-align: center;
  font-size: 17px;
  padding: 3px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid rgb(94, 92, 92);
}

.upList .listBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 0 auto;
  width: 100%;
  padding: 0;
}

.listBox .boxItem {
  width: 300px;
  height: 300px;
}
.listBox .boxItem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nullP {
  padding-top: 10px;
  text-align: center;
}
</style>
