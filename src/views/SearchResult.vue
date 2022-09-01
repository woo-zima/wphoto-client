<template>
    <div class="Search">
        <WaterFall :picList="state.picList" :column="state.column" @nextPage="nextPage" class="photoVirualList"
            ref="photoVirual">
        </WaterFall>
    </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const $api = inject('$api');
const route = useRoute()
const state = reactive({
    picList: [],
    column: 4
})
const photoVirual = ref()

onMounted(() => {
    nextPage()
})

const nextPage = async () => {
    const reParams = { queryValue: route.query.key }
    const { data } = await $api.photo.getKeyPhotos(reParams);
    if (data) {
        state.picList.push(...data)
        // console.log(state.picList);
    }
}
</script>

<style scoped>
.Search {
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