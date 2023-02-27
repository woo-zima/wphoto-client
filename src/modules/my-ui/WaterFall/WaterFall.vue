<template>
  <div class="photoVirualList" ref="photoVirual" @scroll="scrollHandle">
    <div class="virtual-collection" ref="virtualCollection">
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
import {
  onMounted,
  onUnmounted,
  nextTick,
  reactive,
  watch,
  ref,
  computed,
  useAttrs,
  onBeforeMount,
} from 'vue';

const props = defineProps({
  picList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['nextPage', 'resetColumn']);
const attrs = useAttrs();

const state = reactive({
  flag: true,
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
const virtualCollection = ref();
onBeforeMount(() => {
  window.addEventListener('resize', throttle(resetWindow), false);
});
onMounted(() => {
  // nextTick(() => {
  //   rederPhotoList(props.picList, state.pageNum);
  //   state.scrollY++;
  // });
  let { clientWidth } = document.scrollingElement;
  let outE = photoVirual.value;
  setStyle(outE, clientWidth, 648);
});
onUnmounted(() => {
  window.removeEventListener('resize', resetWindow, false);
});
const picLists = computed(() => {
  return props.picList;
});
const currentColumn = computed(() => {
  return Number(attrs.column);
});

watch(
  () => attrs.column,
  () => {
    nextTick(() => {
      // resetWindow('load')
      scrollRederPhotoList(props.picList);
      resetWindow('load');
    });
  },
  { deep: true }
);
watch(
  () => props,
  (newVal, oldVal) => {
    nextTick(() => {
      //更多图片加载
      rederPhotoList(newVal.picList.slice(state.pageNum), state.pageNum);
      state.scrollY++;
      if (state.flag) {
        resetWindow('load');
        state.flag = false;
      }
    });
  },
  { deep: true }
);

const rederPhotoList = (data, pageNum) => {
  state.pageNum += 16;
  let oItems = Array.from(document.querySelectorAll('.picBox')),
    oItemsSlice = oItems.slice(pageNum);
  data.forEach((elem, idx) => {
    if (idx > oItems.length) return;
    let minIdx = -1;
    let itemleft =
      (idx + 1) % currentColumn.value === 1 ? '0' : idx * (state.itemWidth + state.gap);
    oItemsSlice[idx].style.width = state.itemWidth + 'px';
    oItemsSlice[idx].style.height =
      Math.round((elem.pheight * state.itemWidth) / elem.pwidth) + 'px';

    if ((idx + 1) % 4 === 0) {
      state.minHeightArr.push(oItems[idx].offsetHeight);
    }
    if (idx < currentColumn.value && pageNum == 0) {
      state.heightArr.push(oItems[idx].offsetHeight);
      oItems[idx].style.top = '0';
      oItems[idx].style.left = itemleft + 'px';
    } else {
      minIdx = getMin(state.heightArr);
      oItemsSlice[idx].style.left = oItems[minIdx].offsetLeft + 'px';
      oItemsSlice[idx].style.top = state.heightArr[minIdx] + state.gap + 'px';
      state.heightArr[minIdx] += oItemsSlice[idx].offsetHeight + state.gap;
    }
  });
};
const scrollRederPhotoList = data => {
  state.heightArr = [];
  let oItems = Array.from(document.querySelectorAll('.picBox'));
  data.forEach((elem, idx) => {
    if (idx > oItems.length) return;
    let minIdx = -1;
    let itemleft =
      (idx + 1) % currentColumn.value === 1 ? '0' : idx * (state.itemWidth + state.gap);
    oItems[idx].style.width = state.itemWidth + 'px';
    oItems[idx].style.height = Math.round((elem.pheight * state.itemWidth) / elem.pwidth) + 'px';
    if (idx < currentColumn.value) {
      state.heightArr.push(oItems[idx].offsetHeight);
      oItems[idx].style.top = '0';
      oItems[idx].style.left = itemleft + 'px';
    } else {
      minIdx = getMin(state.heightArr);
      oItems[idx].style.left = oItems[minIdx].offsetLeft + 'px';
      oItems[idx].style.top = state.heightArr[minIdx] + state.gap + 'px';
      state.heightArr[minIdx] += oItems[idx].offsetHeight + state.gap;
    }
  });
};

const getMin = arr => {
  return [].indexOf.call(arr, Math.min.apply(null, arr));
};
const getMax = arr => {
  return [].indexOf.call(arr, Math.max.apply(null, arr));
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

const scrollHandle = async () => {
  let heightMax = state.heightArr[getMax(state.heightArr)];
  let coreE = virtualCollection.value;
  const res = await getToButton();
  if (res === 'true') {
    emit('nextPage', state.scrollY);
    setStyle(coreE, getCoreWidth(), heightMax);
  }
};

const getToButton = () => {
  let { scrollTop, scrollHeight, clientHeight } = photoVirual.value;
  return new Promise((resolve, _) => {
    if (scrollTop + clientHeight >= state.heightArr[getMin(state.heightArr)] - 80) {
      setTimeout(() => {
        resolve('true');
      }, 200);
    }
  });
};

const resetWindow = SFlag => {
  let { clientWidth } = document.scrollingElement;
  let outE = photoVirual.value;
  let coreE = virtualCollection.value;

  setStyle(outE, clientWidth, 648);

  let heightMax = state.heightArr[getMax(state.heightArr)];
  if (clientWidth >= 1200) {
    emit('resetColumn', 4);
    // 298*4
    if (SFlag == 'load') {
      setStyle(coreE, 1192, heightMax);
    }
  } else if (clientWidth >= 890) {
    emit('resetColumn', 3);
    // 298*3
    if (SFlag == 'load') {
      setStyle(coreE, 894, heightMax);
    }
  } else {
    emit('resetColumn', 2);
    // 298*3
    if (SFlag == 'load') {
      setStyle(coreE, 596, heightMax);
    }
  }
};
const getCoreWidth = () => {
  let { clientWidth } = document.scrollingElement;
  if (clientWidth >= 1200) {
    return 1192;
  } else if (clientWidth >= 890) {
    return 894;
  } else {
    return 596;
  }
};

function setStyle(el, width, height) {
  if (el) {
    el.setAttribute('style', `width:${width}px;height:${height}px`);
  }
}
function setColumn(el, number) {
  el.setAttribute('column', number);
}
function throttle(func, ms = 300) {
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
  overflow-y: scroll;
  overflow-x: auto;
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
