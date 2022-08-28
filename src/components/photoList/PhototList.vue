<template>
    <div class="photoList">
        <div class="picBox" v-for="item in props.picList">
            <img :src="'wphoto.top/' + item.purl">
            <div class="imgBottom">
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, reactive } from "vue";

const props = defineProps({
    picList: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['change'])

const state = reactive({
    scrollY: 0,
    columnHeight: [],
    column: 4,
    gap: 10,
    itemWidth: 288,
    pageNum: 0,
    pageSize: 20,
    heightArr: [],
    pictureList: [],
})

onMounted(() => {
    rederPhotoList(props.picList, 0);
    console.log(props.picList);
}
)

const rederPhotoList = (data, pageNum) => {
    let oItems = document.getElementsByClassName('picBox');
    data.forEach(function (elem, idx) {
        let minIdx = -1;
        let p = state.pictureList[idx];
        let itemleft = (idx + 1) % state.column === 1 ? '0' : idx * (state.itemWidth + state.gap);
        oItems[idx + pageNum].style.width = state.itemWidth + 'px';
        oItems[idx + pageNum].style.height = Math.round(elem.pheight * state.itemWidth / elem.pwidth) + 'px';

        if (idx < state.column && pageNum == 0) {
            state.heightArr.push(oItems[idx].offsetHeight)
            oItems[idx + pageNum].style.top = '0';
            oItems[idx + pageNum].style.left = itemleft + 'px';
            //console.log(this.heightArr); 
            // console.log(oItems[1].style);
        } else {
            minIdx = getMin(state.heightArr);
            oItems[idx + pageNum].style.left = oItems[minIdx].offsetLeft + 'px';
            oItems[idx + pageNum].style.top = state.heightArr[minIdx] + state.gap + 'px';
            state.heightArr[minIdx] += oItems[idx + pageNum].offsetHeight + state.gap;
        }
    });
}

const getMin = (arr) => {
    return [].indexOf.call(arr, Math.min.apply(null, arr));
}

</script>

<style scoped>
.photoList {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    overflow-y: scroll;
}

.picBox {
    position: absolute;
    /* background-color: #abc; */
    /* overflow: hidden; */
    border-radius: 10px;
}

.picBox img {
    display: block;
    width: 100%;
    border-radius: 10px;
    cursor: pointer;
}
</style>