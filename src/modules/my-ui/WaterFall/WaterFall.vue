<template>
  <div class="photoVirualList" ref="photoVirual" @scroll="scrollHandle">
    <div class="virtual-collection">
      <div
        class="picBox"
        ref="picBox"
        v-for="(item, index) in picLists"
        :key="index"
        @click.stop="goDetail(item)"
      >
        <img :src="'http://wphoto.top/' + item.purl" />
        <div class="imgBottom"></div>
      </div>
    </div>
    <DialogMain :dialogConfig="state.dialogConfig" />
  </div>
</template>

<script setup>
import { onMounted, nextTick, reactive, watch, ref, computed } from 'vue';

const props = defineProps({
  picList: {
    type: Array,
    default: () => [],
  },
  column: {
    type: Number,
    default: () => 4,
  },
});
const emit = defineEmits(['nextPage']);

const state = reactive({
  scrollY: 1,
  columnHeight: [],
  column: 4,
  gap: 10,
  itemWidth: 288,
  pageNum: 0,
  pageSize: 16,
  heightArr: [],
  minHeightArr: [],
  pictureList: [],
  showList: [],
  dialogConfig: {
    showDialog: false,
    dialogItem: {},
    preview: true,
  },
});
const photoVirual = ref();

onMounted(() => {
  // nextTick(() => {
  //   rederPhotoList(props.picList, state.pageNum);
  //   state.scrollY++;
  // });
});
const picLists = computed(() => {
  return props.picList;
});
const showScrollY = computed(() => {
  let { scrollTop } = photoVirual.value;
  return state.scrollY;
});
watch(
  () => props,
  (newVal, oldVal) => {
    nextTick(() => {
      console.log(newVal);
      state.column = newVal.column;
      rederPhotoList(newVal.picList, state.pageNum);
      state.scrollY++;
    });
  },
  { deep: true }
);

const rederPhotoList = (data, pageNum) => {
  state.pageNum += 16;
  let oItems = document.getElementsByClassName('picBox');
  data.forEach((elem, idx) => {
    if (!oItems[idx + pageNum]) return;
    let minIdx = -1;
    let itemleft = (idx + 1) % state.column === 1 ? '0' : idx * (state.itemWidth + state.gap);
    oItems[idx + pageNum].style.width = state.itemWidth + 'px';
    oItems[idx + pageNum].style.height =
      Math.round((elem.pheight * state.itemWidth) / elem.pwidth) + 'px';
    if ((idx + 1) % 4 === 0) {
      state.minHeightArr.push(oItems[idx].offsetHeight);
      // console.log(state.minHeightArr);
    }
    if (idx < state.column && pageNum == 0) {
      state.heightArr.push(oItems[idx].offsetHeight);
      oItems[idx + pageNum].style.top = '0';
      oItems[idx + pageNum].style.left = itemleft + 'px';
      // console.log(elem);
    } else {
      minIdx = getMin(state.heightArr);
      oItems[idx + pageNum].style.left = oItems[minIdx].offsetLeft + 'px';
      oItems[idx + pageNum].style.top = state.heightArr[minIdx] + state.gap + 'px';
      state.heightArr[minIdx] += oItems[idx + pageNum].offsetHeight + state.gap;
    }
  });
};
const getMin = arr => {
  return [].indexOf.call(arr, Math.min.apply(null, arr));
};
const goDetail = item => {
  state.dialogConfig.showDialog = true;
  state.dialogConfig.dialogItem = item;
};
const orderCount = arr => {
  let resArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      resArr.push(arr[i]);
    } else {
      resArr.push(resArr.at(-1) + arr[i]);
    }
  }
  return resArr;
};

const scrollHandle = () => {
  // console.log(photoVirual.value.scrollTop);
  // let flag = [0];
  let minfinalArr = orderCount(state.minHeightArr);
  let { scrollTop, scrollHeight, clientHeight } = photoVirual.value;
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('button');
    emit('nextPage', state.scrollY);
  }
  // for (let i = 0; i < minfinalArr.length; i++) {
  //     if (scrollTop > minfinalArr[i] && scrollTop < minfinalArr[i + 1]) {
  //         console.log(i);
  //     }
  // }
};

function throttle(func, ms = 500) {
  let canRun = true;
  return function () {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      func.apply(this, arguments);
      canRun = true;
    }, ms);
  };
}
</script>

<style scoped>
.el-dialog {
  width: 80vw !important;
}

.photoVirualList {
  width: 1200px;
  overflow-y: scroll;
  overflow-x: auto;
}
@media screen and (max-width: 1250px) {
  .photoVirualList {
    width: 900px;
  }
}
@media screen and (max-width: 950px) {
  .photoVirualList {
    width: 500px;
  }
}
.virtual-collection {
  position: relative;
  margin: 10px auto;
}

.picBox {
  position: absolute;
  border-radius: 10px;
  overflow: hidden;
}

.picBox img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}
</style>
